import { useTrigger } from "@resolvers/trigger";
import { getBranch } from "@utils/git";
import type { Config } from "@type/index";

export const call = async (config: Config) => {
  const { trigger } = useTrigger(config);
  for (const pipeline of config.pipelines) {
    await trigger(pipeline.name);
  }
};
