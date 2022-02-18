import { log } from "@composables/logger";
import { useExec } from "@composables/exec";
import type { Config, Pipeline, Action } from "@def/types";
import { getBranch } from "@utils/git";
import { fork } from "@utils/forker";
import { reducerName, reducerBranch, reducerAction } from "@composables/config";
export const useTrigger = (config: Config) => {
  const { execPipeline } = useExec();

  const trigger = async (name?: string, options?: any) => {
    const n = name ? name : "default";
    const hasName = await reducerName({ name: n, config: config });
    const hasBranch = await reducerBranch({ name: n, config: hasName });
    for (const pipeline of hasBranch.pipelines) {
      try {
        if (options && options.spawn) {
          log.debug(`Running pipeline ${n} in background...`);
          await fork({ pipeline: n });
        } else {
          await execPipeline(pipeline);
        }
      } catch (err) {
        return err;
      }
    }
  };

  const bulkTrigger = async (action: Action) => {
    const hasBranch = await reducerBranch({ config: config });
    const hasAction = await reducerAction({
      action: action,
      config: hasBranch
    });
    for (const pipeline of hasAction.pipelines) {
      try {
        await execPipeline(pipeline);
      } catch (err) {
        return err;
      }
    }
  };

  return {
    trigger,
    bulkTrigger
  };
};
