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

export const useHooks = (config?: Config) => {
  const { exec } = useExec();
  return {
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
