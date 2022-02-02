import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import type {
  Config,
  Pipeline,
  ExecOptions,
  TriggerOptions
} from "@type/index";

let config: Config = useConfig();

export const useTrigger = (conf?: Config) => {
  const { execPipeline } = useExec();
  const trigger = async (name: string) => {
    config = useConfig(conf);
    if (!config) return;
    const pipelines = config.pipelines.filter(
      (pipeline: Pipeline) => pipeline.name == name
    );
    if (pipelines.length == 0) {
      log.warn(`pipeline "${name}" is undefined`);
      return;
    }
    if (pipelines.length > 1) {
      log.warn(`pipeline "${name}" has duplicates`);
      return;
    }
    for (const pipeline of pipelines) {
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
