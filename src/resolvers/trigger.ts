import { defaultLog } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import type { Config, Pipeline } from "@type/index";

export const useTrigger = (config: Config) => {
  const log = defaultLog;
  const { execPipeline } = useExec();

  const trigger = async (name: string) => {
    if (!config) return;
    const pipelines = config.pipelines.filter(
      (pipeline: Pipeline) => pipeline.name == name
    );
    if (!isUnique(pipelines)) return;
    for (const pipeline of pipelines) {
      try {
        await execPipeline(pipeline);
      } catch (err) {
        return err;
      }
    }
  };
  const isUnique = (pipelines: Pipeline[]) => {
    if (pipelines.length == 0) {
      log.warn(`pipeline "${name}" is undefined`);
      return false;
    }
    if (pipelines.length > 1) {
      log.warn(`pipeline "${name}" has duplicates`);
      return false;
    } else {
      return true;
    }
  };

  return {
    trigger,
    isUnique
  };
};
