import { useTrigger } from "@resolvers/trigger";
import { getBranch } from "@utils/git";
import type { Config } from "@type/index";

export const call = async (config: Config) => {
  const { bulkTrigger } = useTrigger(config);
  await bulkTrigger();
};
