import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";

export const deploy = async () => {
  const { exec } = useExec();
  const config = await useConfig();
  for (const pipeline of config.pipelines) {
    for (const command of pipeline.commands) {
      exec(command);
    }
    for (const step of pipeline.steps) {
    }
  }
};
