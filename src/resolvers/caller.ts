import { useTrigger } from "@resolvers/trigger";
import { useConfig } from "@composables/config";
import { getBranch } from "@utils/branch";
import type { Config, Pipeline } from "@type/index";
import { log } from "@composables/logger";

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
