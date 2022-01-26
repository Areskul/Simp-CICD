import { log } from "@composables/logger";
import { execSync as $ } from "child_process";
import { green, red, blue } from "picocolors";
import type { Pipeline, Step } from "@type/index";

export const useExec = () => ({
  execPipeline,
  execStep,
  exec
});

const exec = async (cmd: string) => {
  try {
    const res = await $(cmd, {
      stdio: ["ignore", "ignore", "pipe"]
    });
    log.debug(green(cmd));
    return;
  } catch (err) {
    log.error(err);
    console.log(red("Some commands couldn't be executed"));
    return err;
  }
};
const execStep = async (step: Step) => {
  out: for (const command of step.commands) {
    try {
      await exec(command);
    } catch (err) {
      return err;
    }
  }
};
const execPipeline = async (pipeline: Pipeline) => {
  out: for (const step of pipeline.steps) {
    try {
      await execStep(step);
    } catch (err) {
      return err;
    }
  }
};
