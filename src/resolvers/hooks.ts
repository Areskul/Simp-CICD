import {
  writeFile,
  chmod,
  writeFileSync,
  chmodSync,
  existsSync,
  unlinkSync,
  mkdirSync
} from "fs";
import path from "path";
import { log } from "@composables/logger";
import type { Config, Pipeline, Action } from "@type/index";
import { useTrigger } from "@resolvers/trigger";
import { useExec } from "@composables/exec";
import { useConfig } from "@composables/config";
import { getBranch } from "@utils/branch";
import { rollup, OutputBundle, OutputChunk } from "rollup";

export const useHooks = (config: Config) => {
  const generateHook = async (name: string) => {
    const { exec } = useExec();
    const pipelines = config.pipelines.filter(
      (pipeline: Pipeline) => pipeline.name == name
    );
    if (pipelines.length == 0) {
      log.warn(`pipeline "${name}" is undefined`);
      return;
    }
    if (pipelines.length > 1) {
      log.warn(`pipeline "${name}" has duplicates`);
      return;
    }
    for (const pipeline of pipelines) {
      if (!pipeline.trigger) return;
      try {
        const action: Action = pipeline.trigger.action;
        const hookPath = `.simp/hooks/src/${action}/${name}.ts`;
        await exec(`touch ${hookPath}`);
        await writeFile(
          hookPath,
          `import {useTrigger} from "simpcicd"
        `,
          (err) => {
            if (err) {
              log.error(err);
              return err;
            } else {
              log.info("Successfully generated hook files");
              return;
            }
          }
        );
        await chmod(hookPath, 0o0755, (err) => {
          if (err) {
            log.error(err);
            return err;
          }
          return;
        });
        //file goes in pre-push folder
        //conditionnal
      } catch (err) {
        log.error(err);
        return err;
      }
    }
  };

  /* create entry file .ts
   * that trigger pipeline
   **/
  return {
    caller,
    generateHook,
    printHooks,
    build,
    generateOutputs
  };
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
  // replace bundle.generate with bundle.write to directly write to disk
  try {
    const { output } = await bundle.write(outputOptions("test"));
  } catch (err) {
    log.warn("Couldn't generate git-hook scripts");
  }
};

// Calls every script for a given hook
const caller = () => {
  //exec evry file in pre-push folder...
};

const printHooks = () => {
  //
};
