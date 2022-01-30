import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import type {
  Pipeline,
  ExecOptions,
  StepOptions,
  TriggerOptions
} from "@type/index";

const ex = useExec();
const config = useConfig();

export const useTrigger = () => {
  return {
    trigger
  };
};

const trigger = async (name: string) => {
  const conf = await config.set();
  if (!conf) return;
  for (const pipeline of conf.pipelines) {
    if (pipeline.name == name) {
      try {
        await ex.execPipeline(pipeline);
      } catch (err) {
        log.warn(err);
        return err;
      }
    } else {
      log.warn(`pipeline \"${name}\" is undefined`);
    }
  }
};
