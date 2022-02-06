import { useExec } from "@composables/exec";
import { log } from "@composables/logger";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { chmod, writeFile } from "fs";
import { useFs } from "@composables/fs";

const { ln, unln } = useFs();

export const buildCaller = async () => {
  const { exec } = useExec();
  const action = "pre-push";
  const nodeExecPath = "#!/usr/bin/node";
  const input = `src/utils/template/caller.template.ts`;
  const output = `dist/cjs/caller.js`;
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
    const bundle = await rollup({
      input: input,
      plugins: plugins
    });
    await bundle.write({
      banner: nodeExecPath,
      file: output,
      format: "cjs"
    });
    await chmod(output, 0o0755, (err: any) => {
      if (err) {
        log.error(err);
        return err;
      }
      return;
    });
  } catch (err) {
    log.error(err);
    return;
  }
};

export const buildForker = async () => {
  const action = "pre-push";
  const nodeExecPath = "#!/usr/bin/node";
  const input = `src/utils/template/forker.template.ts`;
  const output = `dist/cjs/forker.js`;
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
    const bundle = await rollup({
      input: input,
      plugins: plugins
    });
    await bundle.write({
      banner: nodeExecPath,
      file: output,
      format: "cjs"
    });
    await chmod(output, 0o0755, (err: any) => {
      if (err) {
        log.error(err);
        return err;
      }
      return;
    });
    await unln(`.git/hooks/${action}`);
    await ln({ target: `../../${output}`, path: `.git/hooks/${action}` });
  } catch (err) {
    log.error(err);
    return;
  }
};

export const useBuild = () => {
  buildCaller, buildForker;
};
