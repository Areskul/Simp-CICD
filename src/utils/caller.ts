import { useTrigger } from "@resolvers/trigger";
import { getBranch } from "@utils/git";
import type { Config, Pipeline } from "@type/index";
import { log } from "@composables/logger";

export const call = async (config: Config) => {
  const actualBranch = await getBranch();

  config.pipelines = config.pipelines.filter((pipeline: Pipeline) =>
    pipeline.trigger.branches.includes(actualBranch)
  );

  const { trigger } = useTrigger(config);
  for (const pipeline of config.pipelines) {
    await trigger(pipeline.name);
  }
};
