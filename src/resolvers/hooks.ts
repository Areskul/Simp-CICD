import { log } from "@composables/logger";
import type { Config, Pipeline, Action } from "@type/index";
import { useTrigger } from "@resolvers/trigger";
import { useExec } from "@composables/exec";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { useFs } from "@composables/fs";
import { getGitPath } from "@utils/git";

export const useHooks = (config?: Config) => {
  const { ln } = useFs();
  const linkHooks = async () => {
    const gitRoot = await getGitPath();
    await ln({
      target: "../bin/forker.js",
      path: `${gitRoot}/.git/hooks/pre-push`
    });
  };
  return {
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
