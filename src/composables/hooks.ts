import fs from "fs";
import path from "path";
import type { Config } from "@type/index";

export const useHooks = (config?: Config) => ({
  // generate hooks from config
  makeHook,
  printHooks
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

const makeHook = (config: Config) => {
  //
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
