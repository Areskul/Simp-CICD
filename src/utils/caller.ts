import { useTrigger } from "@resolvers/trigger";
import type { Config, Action } from "@type/index";

export const call = async (config: Config) => {
  const action = process.argv[2] as Action;
  const { bulkTrigger } = useTrigger(config);
  await bulkTrigger(action);
};
