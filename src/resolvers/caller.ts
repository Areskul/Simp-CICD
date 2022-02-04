import { useTrigger } from "@resolvers/trigger";
import { useConfig } from "@composables/config";
import { getBranch } from "@utils/branch";
import type { Config, Pipeline } from "@type/index";

const caller = (config: Config) => {
  const pipelines = config.pipelines.filter((pipeline: Pipeline) =>
    pipeline.trigger.branch.includes(getBranch())
  );
  const { trigger } = useTrigger(useConfig());
  for (const pipeline of pipelines) {
    trigger(pipeline.name);
  }
};

caller();
