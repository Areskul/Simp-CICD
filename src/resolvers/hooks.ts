import { log } from "@composables/logger";
import type { Config, Action } from "@def/types";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { getGitPath } from "@utils/git";
import { getActions } from "@composables/config";
import Fs from "@supercharge/fs";

export const useHooks = (config?: Config) => {
  const linkHook = async (action: Action) => {
    const gitRoot = await getGitPath();
    const path = `${gitRoot}/.git/hooks/${action}`;
    const target = `${gitRoot}/node_modules/simpcicd/dist/bin/forker/${action}.mjs`;
    try {
      await Fs.ensureSymlink(target, path);
      await log.info(`ln -s ${path} -> ${target}`);
      return;
    } catch (err) {
      log.error(err);
      return;
    }
  };

  const linkHooks = async (config: Config) => {
    const actions = getActions(config);
    for (const action of actions) {
      await linkHook(action);
    }
  };
  const makeHooks = linkHooks;

  return {
    makeHooks,
    linkHooks,
    toHook
  };
};

const toHook = async (target: string) => {
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
