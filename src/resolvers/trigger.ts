import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import type {
  Pipeline,
  ExecOptions,
  StepOptions,
  TriggerOptions
} from "@type/index";

const { execPipeline } = useExec();
const config = useConfig();

export const trigger = async () => {
  const conf = config.get();
  if (!conf) return;
  for (const pipeline of conf.pipelines) {
    try {
      await execPipeline(pipeline);
    } catch (err) {
      return err;
    }
  }
};
