import { useTrigger } from "@resolvers/trigger";
import type { Config, Action } from "@def/types";

interface Args {
  action: Action;
  config: Config;
}

export const call = async ({ config, action }: Args) => {
  const { bulkTrigger } = useTrigger(config);
  await bulkTrigger(action);
};
