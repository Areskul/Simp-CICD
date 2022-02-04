import {
  writeFile,
  chmod,
  writeFileSync,
  chmodSync,
  existsSync,
  unlinkSync,
  mkdirSync,
  symlink,
  symlinkSync
} from "fs";
import path from "path";
import { log } from "@composables/logger";
import type { Config, Pipeline, Action } from "@type/index";
import { useTrigger } from "@resolvers/trigger";
import { useExec } from "@composables/exec";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";

const { exec } = useExec();

export const useHooks = (config?: Config) => {
  return {
    buildCaller,
    toHook
  };
};

const toHook = async (input: string) => {
  //turn ts file into hook
};

const inputOptions = (name: string) => ({
  input: `.simp/hooks/src/simp.${name}.hook.ts`
});

const outputOptions = (name: string) => {
  const nodeExecPath = "#!/usr/bin/node";
  return {
    banner: nodeExecPath,
    file: `.simp/hooks/cjs/simp.${name}.hook.js`,
    format: "cjs"
  };
};

const build = async () => {
  try {
    const bundle = await rollup(inputOptions("test"));
    await generateOutputs(bundle);
  } catch (err) {
    log.error(err);
  }
};

const generateOutputs = async (bundle: any) => {
  try {
    const { output } = await bundle.write(outputOptions("test"));
  } catch (err) {
    log.warn("Couldn't generate githook script");
  }
};

const buildCaller = async () => {
  const action = "pre-push";
  const nodeExecPath = "#!/usr/bin/node";
  const hooksCjs = `.simp/hooks/cjs/${action}/`;
  const input = `.simp/hooks/src/${action}/index.ts`;
  const output = `${hooksCjs}/index.js`;
  // await exec(`touch ${input}`);
  await exec(`mkdir -p  ${hooksCjs}`);
  // await writeFile(
  //   input,
  //   `
  //   import { caller } from "@resolvers/caller";
  //   import { useConfig } from "@composables/config";
  //
  //   caller(useConfig());
  //   `,
  //   (err) => {
  //     if (err) {
  //       log.error(err);
  //       return err;
  //     } else {
  //       log.info("Successfully generated caller");
  //       return;
  //     }
  //   }
  // );

  const plugins = [
    typescript({
      module: "esnext",
      target: "esnext"
    }),
    typescriptPaths({
      preserveExtensions: true
    })
  ];
  try {
    await exec(`touch ${output}`);
    const bundle = await rollup({
      input: input,
      plugins: plugins
    });
    await bundle.write({
      banner: nodeExecPath,
      file: output,
      format: "cjs"
    });
    // await exec(`chmod +x ${output}`);
    await chmod(output, 0o0755, (err) => {
      if (err) {
        log.error(err);
        return err;
      }
      return;
    });
    await exec(`ln -sf ../../${output} .git/hooks/${action}`);
  } catch (err) {
    log.error(err);
    return;
  }
};
