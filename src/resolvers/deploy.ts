import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import type { Pipeline } from "@type/index";

const { execPipeline } = useExec();

export const deploy = async () => {
  const config = await useConfig();
  out: for (const pipeline of config.pipelines) {
    try {
      await execPipeline(pipeline);
    } catch (err) {
      return;
    }
  }
};
