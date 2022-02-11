import { defaultLog } from "@composables/logger";
import { useExec } from "@composables/exec";
import type { Config, Pipeline } from "@type/index";
import { getBranch } from "@utils/git";

export const log = defaultLog;
export const useTrigger = (config: Config) => {
  const { execPipeline } = useExec();

  const trigger = async (name?: string) => {
    const n = name ? name : "default";
    if (!config) return;
    const hasName = config.pipelines.filter(
      (pipeline: Pipeline) => pipeline.name == n
    );
    if (hasName.length == 0) {
      log.debug(`couldn't find pipeline "${n}"`);
      return;
    }
    const actualBranch = await getBranch();
    const hasBranch = hasName.filter((pipeline: Pipeline) =>
      pipeline.trigger.branches.includes(actualBranch)
    );
    if (hasBranch.length == 0) {
      log.debug(`checkout to permitted branch to triggger pipeline "${n}"`);
      return;
    }
    for (const pipeline of hasBranch) {
      try {
        await execPipeline(pipeline);
      } catch (err) {
        return err;
      }
    }
  };
  return {
    trigger
  };
};
