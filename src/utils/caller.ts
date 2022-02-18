import { useTrigger } from "@resolvers/trigger";
import { useExec } from "@composables/exec";
import type { Config, Action } from "@def/types";
import { reducerName, reducerBranch } from "@composables/config";

interface Args {
  action: Action;
  config: Config;
  pipeline?: string;
}

export const call = async ({ config, action, pipeline }: Args) => {
  const { execPipeline } = useExec();
  const { bulkTrigger } = useTrigger(config);
  if (!!pipeline) {
    const hasName = await reducerName({ name: pipeline, config: config });
    const hasBranch = await reducerBranch({ name: pipeline, config: hasName });
    for (const pipeline of hasBranch.pipelines) {
      execPipeline(pipeline);
    }
  }
  await bulkTrigger(action);
};
