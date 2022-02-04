import { useTrigger } from "@resolvers/trigger";
import { useExec } from "@composables/exec";
import { useConfig } from "@composables/config";
import { getBranch } from "@utils/branch";
import type { Config, Pipeline } from "@type/index";
import { log } from "@composables/logger";
import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { chmod } from "fs";

export const caller = async (config: Config) => {
  const actualBranch = await getBranch();

  config.pipelines = config.pipelines.filter(async (pipeline: Pipeline) =>
    pipeline.trigger.branch.includes(actualBranch)
  );
  log.debug(config);
  const { trigger } = useTrigger(config);
  for (const pipeline of config.pipelines) {
    await trigger(pipeline.name);
  }
};

export const buildCaller = async () => {
  const { exec } = useExec();
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
    await chmod(output, 0o0755, (err: any) => {
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
