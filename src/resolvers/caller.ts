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
