import fs from "fs";
import path from "path";
import { log } from "@composables/logger";
import type { Config, Pipeline } from "@type/index";
import { useTrigger } from "@resolvers/trigger";
import { useConfig } from "@composables/config";
import { rollup, OutputBundle, OutputChunk } from "rollup";

const config = useConfig();

export const useHooks = (conf?: Config) => {
  const otherConfig = conf;
  /* create entry file .ts
   * that trigger pipeline
   **/
  const makeHook = async (name: string) => {
    const conf = await config.set(otherConfig ? otherConfig : undefined);
    if (!conf) return;
    const pipelines = conf.pipelines.filter(
      (pipeline: Pipeline) => pipeline.name == name
    );
  };

  return {
    caller,
    makeHook,
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
