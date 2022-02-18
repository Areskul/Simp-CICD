import { useTrigger } from "@resolvers/trigger";
import type { Config, Pipeline, Action } from "@def/types";

interface Args {
  action: Action;
  config: Config;
  pipeline?: string;
}

export const call = async ({ config, action, pipeline }: Args) => {
  const { bulkTrigger, trigger } = useTrigger(config);
  if (!!pipeline) {
    trigger(pipeline);
  }
  await bulkTrigger(action);
};
