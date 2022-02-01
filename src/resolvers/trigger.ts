import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import type {
  Config,
  Pipeline,
  ExecOptions,
  TriggerOptions
} from "@type/index";

const ex = useExec();
const config = useConfig();

export const useTrigger = (conf?: Config) => {
  const otherConfig = conf;

  const trigger = async (name: string) => {
    const conf = await config.set(otherConfig ? otherConfig : undefined);
    if (!conf) return;
    const pipelines = conf.pipelines.filter(
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
        await ex.execPipeline(pipeline);
      } catch (err) {
        return err;
      }
    }
  };

  return {
    trigger
  };
};
