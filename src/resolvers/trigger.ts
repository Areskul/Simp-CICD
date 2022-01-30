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

const trigger = async () => {
  const conf = config.get();
  if (!conf) return;
  for (const pipeline of conf.pipelines) {
    try {
      await ex.execPipeline(pipeline);
    } catch (err) {
      return err;
    }
  }
};
