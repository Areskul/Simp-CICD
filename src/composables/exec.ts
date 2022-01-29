import { log } from "@composables/logger";
import { execSync as $ } from "child_process";

import { green, red, blue } from "picocolors";
import type { Pipeline, Step, ExecOptions } from "@type/index";

export const useExec = () => ({
  set,
  execPipeline,
  execStep,
  exec
});

let ctx: ExecOptions = {};

const set = (newCtx: ExecOptions) => {
  ctx = newCtx;
  log.info(ctx);
};

const exec = async (cmd: string) => {
  try {
    const res = await $(cmd, {
      stdio: ["ignore", "pipe", "pipe"]
    });
    console.log(green("\t\t" + cmd));
    if (ctx.verbose) log.debug(res.toString());
    return;
  } catch (err) {
    log.error(err);
    console.log(red("Some commands couldn't be executed"));
    throw err;
  }
};
const execStep = async (step: Step) => {
  console.log(`\t step: ${step.name}`);
  out: for (const command of step.commands) {
    try {
      await exec(command);
    } catch (err) {
      throw err;
    }
  }
};
const execPipeline = async (pipeline: Pipeline) => {
  console.log(`pipeline: ${pipeline.name}`);
  out: for (const step of pipeline.steps) {
    try {
      await execStep(step);
    } catch (err) {
      throw err;
      // return err;
    }
  }
};
