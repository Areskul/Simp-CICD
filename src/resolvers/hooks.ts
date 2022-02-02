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
import type { Config, Pipeline } from "@type/index";
import { useTrigger } from "@resolvers/trigger";
import { useExec } from "@composables/exec";
import { useConfig } from "@composables/config";
import { getBranch } from "@utils/branch";
import { rollup, OutputBundle, OutputChunk } from "rollup";

let config: Config;
const setConfig = async () => {
  config = await useConfig();
};
setConfig();

const { exec } = useExec();

export const useHooks = (conf?: Config) => {
  // config = await useConfig(conf ? conf : undefined);
  // if (!config) return;
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

const generateHook = async (name: string) => {
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
    if (pipeline.trigger.action.includes("push")) {
      log.debug(pipeline.trigger);
    }
    try {
      const hookPath = `.simp/hooks/src/pre-push/${name}.ts`;
      await exec(`touch ${hookPath}`);
      // const hookPath = `/.simp/hooks/src/pre-push/${name}.ts`;
      // const hookPath = `@hooks/pre-push/${name}.ts`;
      await writeFile(
        hookPath,
        `import {useTrigger} rom "simpcicd"
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

const inputOptions = (name: string) => ({
  input: `.simp/hooks/src/simp.${name}.hook.ts`
});

const outputOptions = (name: string) => ({
  file: `.simp/hooks/cjs/simp.${name}.hook.js`,
  format: "cjs"
});

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
  if (!existsSync(normalizedHookDirectory)) {
    mkdirSync(normalizedHookDirectory);
  }

  writeFileSync(hookPath, hookCommand);
  chmodSync(hookPath, 0o0755);

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

  if (existsSync(hookPath)) {
    unlinkSync(hookPath);
  }
}
