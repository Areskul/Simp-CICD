import fs from "fs";
import path from "path";
import { log } from "@composables/logger";
import type { Config } from "@type/index";
import { useTrigger } from "@resolvers/trigger";
import { rollup, OutputBundle, OutputChunk } from "rollup";

export const useHooks = (config?: Config) => ({
  // generate hooks from config
  makeHook,
  printHooks,
  build,
  generateOutputs
});

const VALID_GIT_HOOKS = [
  "pre-commit",
  "pre-merge-commit",
  "prepare-commit-msg",
  "commit-msg",
  "post-commit",
  "pre-rebase",
  "post-checkout",
  "post-merge",
  "pre-push",
  "pre-receive",
  "update",
  "proc-receive",
  "post-receive",
  "post-update",
  "pre-auto-gc",
  "post-rewrite",
  "fsmonitor-watchman"
];

const VALID_OPTIONS = ["preserveUnused"];

const inputOptions = (name: string) => ({
  input: `.simp/hooks/src/simp.${name}.hook.ts`
});

const outputOptions = (name: string) => ({
  file: `.simp/hooks/cjs/simp.${name}.hook.js`,
  format: "cjs"
});

const build = async () => {
  let bundle;
  let buildFailed = false;
  try {
    const bundle = await rollup(inputOptions("test"));
    await generateOutputs(bundle);
  } catch (err) {
    log.error(err);
  }
};

const generateOutputs = async (bundle: any) => {
  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  // replace bundle.generate with bundle.write to directly write to disk
  const { output } = await bundle.write(outputOptions("test"));

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === "asset") {
      // For assets, this contains
      // {
      //   fileName: string,              // the asset file name
      //   source: string | Uint8Array    // the asset source
      //   type: 'asset'                  // signifies that this is an asset
      // }
      log.debug("Asset", chunkOrAsset);
    } else {
      // For chunks, this contains
      // {
      //   code: string,                  // the generated JS code
      //   dynamicImports: string[],      // external modules imported dynamically by the chunk
      //   exports: string[],             // exported variable names
      //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
      //   fileName: string,              // the chunk file name
      //   implicitlyLoadedBefore: string[]; // entries that should only be loaded after this chunk
      //   imports: string[],             // external modules imported statically by the chunk
      //   importedBindings: {[imported: string]: string[]} // imported bindings per dependency
      //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
      //   isEntry: boolean,              // is this chunk a static entry point
      //   isImplicitEntry: boolean,      // should this chunk only be loaded after other chunks
      //   map: string | null,            // sourcemaps if present
      //   modules: {                     // information about the modules in this chunk
      //     [id: string]: {
      //       renderedExports: string[]; // exported variable names that were included
      //       removedExports: string[];  // exported variable names that were removed
      //       renderedLength: number;    // the length of the remaining code in this module
      //       originalLength: number;    // the original length of the code in this module
      //       code: string | null;       // remaining code in this module
      //     };
      //   },
      //   name: string                   // the name of this chunk as used in naming patterns
      //   referencedFiles: string[]      // files referenced via import.meta.ROLLUP_FILE_URL_<id>
      //   type: 'chunk',                 // signifies that this is a chunk
      // }
      console.log("Chunk", chunkOrAsset.modules);
    }
  }
};

/* create entry file .ts
 * that trigger pipeline
 **/
const makeHook = (config: Config) => {};

const printHooks = () => {
  //
};

/**
 * Parses the config and sets git hooks
 * @param {string} projectRootPath
 * @param {string[]} [argv]
 */
function setHooksFromConfig(config: any) {
  const preserveUnused = Array.isArray(config.preserveUnused)
    ? config.preserveUnused
    : config.preserveUnused
    ? VALID_GIT_HOOKS
    : [];

  for (const hook of VALID_GIT_HOOKS) {
    if (Object.prototype.hasOwnProperty.call(config, hook)) {
      setHook(hook, config[hook]);
    } else if (!preserveUnused.includes(hook)) {
      removeHook(hook);
    }
  }
}

/**
 * Creates or replaces an existing executable script in .git/hooks/<hook> with provided command
 * @param {string} hook
 * @param {string} command
 * @param {string} projectRoot
 * @private
 */
function setHook(hook: any, command: any) {
  const gitRoot = "./git";

  const hookCommand = "#!/bin/sh\n" + command;
  const hookDirectory = gitRoot + "/hooks/";
  const hookPath = path.normalize(hookDirectory + hook);

  const normalizedHookDirectory = path.normalize(hookDirectory);
  if (!fs.existsSync(normalizedHookDirectory)) {
    fs.mkdirSync(normalizedHookDirectory);
  }

  fs.writeFileSync(hookPath, hookCommand);
  fs.chmodSync(hookPath, 0o0755);

  console.log(`[INFO] Successfully set the ${hook} with command: ${command}`);
}

/**
 * Deletes all git hooks
 * @param {string} projectRoot
 */
function removeHooks() {
  for (const configEntry of VALID_GIT_HOOKS) {
    removeHook(configEntry);
  }
}

/**
 * Removes the pre-commit hook from .git/hooks
 * @param {string} hook
 * @param {string} projectRoot
 * @private
 */
function removeHook(hook: any) {
  const gitRoot = "./git";
  const hookPath = path.normalize(gitRoot + "/hooks/" + hook);

  if (fs.existsSync(hookPath)) {
    fs.unlinkSync(hookPath);
  }
}

export { setHooksFromConfig, setHook, removeHooks, removeHook };
