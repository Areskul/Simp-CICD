import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import type { Pipeline } from "@type/index";

const { exec } = useExec();

export const deploy = async () => {
  const config = await useConfig();
  for (const pipeline of config.pipelines) {
    if (!!pipeline.commands) {
      for (const command of pipeline.commands) {
        exec(command);
      }
    }
    execSteps(pipeline);
  }
};

const execSteps = (pipeline: Pipeline) => {
  for (const step of pipeline.steps) {
    for (const command of step.commands) {
      exec(command);
    }
  }
};
