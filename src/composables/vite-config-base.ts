import type { Config } from "@def/types";
import fs from "fs";
import path from "path";
import { log } from "@composables/logger";
import { build } from "esbuild";

const { debug, error } = log;

import { isObject, lookupFile, normalizePath, dynamicImport } from "./utils";

const myPackage = {
  name: "simp",
  extension: "config"
};

export async function loadConfigFromFile(
  configFile?: string,
  configRoot: string = process.cwd()
): Promise<{
  config: Config;
  dependencies: string[];
  path: string;
} | null> {
  const start = performance.now();
  const getTime = () => `${(performance.now() - start).toFixed(2)}ms`;
  const { name, extension } = myPackage;

  let resolvedPath: string | undefined;
  let isTS = false;
  let isESM = false;
  let dependencies: string[] = [];

  // check package.json for type: "module" and set `isMjs` to true
  try {
    const pkg = lookupFile(configRoot, ["package.json"]);
    if (pkg && JSON.parse(pkg).type === "module") {
      isESM = true;
    }
  } catch (err) {
    error(err);
  }

  if (configFile) {
    // explicit config path is always resolved from cwd
    resolvedPath = path.resolve(configFile);
    if (configFile.endsWith(".ts")) {
      isTS = true;
      isESM = true;
    }

    if (configFile.endsWith(".mjs")) {
      isESM = true;
    }
  } else {
    // implicit config file loaded from inline root (if present)
    // otherwise from cwd
    const jsconfigFile = path.resolve(configRoot, `${name}.${extension}.js`);
    if (fs.existsSync(jsconfigFile)) {
      resolvedPath = jsconfigFile;
    }

    if (!resolvedPath) {
      const mjsconfigFile = path.resolve(
        configRoot,
        `${name}.${extension}.mjs`
      );
      if (fs.existsSync(mjsconfigFile)) {
        resolvedPath = mjsconfigFile;
        isESM = true;
      }
    }

    if (!resolvedPath) {
      const tsconfigFile = path.resolve(configRoot, `${name}.${extension}.ts`);
      if (fs.existsSync(tsconfigFile)) {
        resolvedPath = tsconfigFile;
        isTS = true;
      }
    }

    if (!resolvedPath) {
      const cjsConfigFile = path.resolve(
        configRoot,
        `${name}.${extension}.cjs`
      );
      if (fs.existsSync(cjsConfigFile)) {
        resolvedPath = cjsConfigFile;
        isESM = false;
      }
    }
  }

  if (!resolvedPath) {
    debug("no config file found.");
    return null;
  }

  try {
    let config: Config | null = null;

    if (isESM) {
      // const fileUrl = require("url").pathToFileURL(resolvedPath);
      const fileUrl = resolvedPath;
      console.log(`this is the fileUrl ${resolvedPath}`);
      const bundled = await bundleConfigFile(resolvedPath, true);
      dependencies = bundled.dependencies;
      if (isTS) {
        console.log("myloop");
        // before we can register loaders without requiring users to run node
        // with --experimental-loader themselves, we have to do a hack here:
        // bundle the config file w/ ts transforms first, write it to disk,
        // load it with native Node ESM, then delete the file.
        fs.writeFileSync(resolvedPath + ".js", bundled.code);

        config = (await dynamicImport(`${fileUrl}.js?t=${Date.now()}`)).default;
        fs.unlinkSync(resolvedPath + ".js");
        debug(`TS + native esm config loaded in ${getTime()}`, fileUrl);
      } else {
        // using Function to avoid this from being compiled away by TS/Rollup
        // append a query so that we force reload fresh config in case of
        // server restart
        config = (await dynamicImport(`${fileUrl}?t=${Date.now()}`)).default;
        debug(`native esm config loaded in ${getTime()}`, fileUrl);
      }
    }

    if (!config) {
      // Bundle config file and transpile it to cjs using esbuild.
      const bundled = await bundleConfigFile(resolvedPath);
      dependencies = bundled.dependencies;
      config = await loadConfigFromBundledFile(resolvedPath, bundled.code);
      debug(`bundled config file loaded in ${getTime()}`);
    }

    if (!isObject(config)) {
      throw new Error(`config must export or return an object.`);
    }
    return {
      path: normalizePath(resolvedPath),
      config,
      dependencies
    };
  } catch (err) {
    error(`failed to load config from ${resolvedPath}`);
    throw err;
  }
}

async function bundleConfigFile(
  fileName: string,
  isESM = false
): Promise<{ code: string; dependencies: string[] }> {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    outfile: "out.js",
    write: false,
    platform: "node",
    bundle: true,
    format: isESM ? "esm" : "cjs",
    sourcemap: "inline",
    metafile: true,
    plugins: [
      {
        name: "externalize-deps",
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
            const id = args.path;
            if (id[0] !== "." && !path.isAbsolute(id)) {
              return {
                external: true
              };
            } else {
              return {
                external: false
              };
            }
          });
        }
      },
      {
        name: "replace-import-meta",
        setup(build) {
          build.onLoad({ filter: /\.[jt]s$/ }, async (args) => {
            const contents = await fs.promises.readFile(args.path, "utf8");
            return {
              loader: args.path.endsWith(".ts") ? "ts" : "js",
              contents: contents
                .replace(
                  /\bimport\.meta\.url\b/g,
                  JSON.stringify(`file://${args.path}`)
                )
                .replace(
                  /\b__dirname\b/g,
                  JSON.stringify(path.dirname(args.path))
                )
                .replace(/\b__filename\b/g, JSON.stringify(args.path))
            };
          });
        }
      }
    ]
  });
  const { text } = result.outputFiles[0];
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : []
  };
}
interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}

async function loadConfigFromBundledFile(
  fileName: string,
  bundledCode: string
): Promise<Config> {
  const extension = path.extname(fileName);
  const defaultLoader = require.extensions[extension]!;
  require.extensions[extension] = (module: NodeModule, filename: string) => {
    if (filename === fileName) {
      (module as NodeModuleWithCompile)._compile(bundledCode, filename);
    } else {
      defaultLoader(module, filename);
    }
  };
  // clear cache in case of server restart
  delete require.cache[require.resolve(fileName)];
  const raw = require(fileName);
  const config = raw.__esModule ? raw.default : raw;
  require.extensions[extension] = defaultLoader;
  return config;
}
