import { log } from "@composables/logger";
import { execSync as $ } from "child_process";

import { green, red, blue, yellow } from "picocolors";
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
};

const exec = async (cmd: string) => {
  const indent = " ".repeat(4);
  try {
    const res = await $(cmd, {
      stdio: ["ignore", "pipe", "pipe"]
    });
    return res;
  } catch (err) {
    throw err;
  }
};
const execStep = async (step: Step) => {
  const indent = " ".repeat(2);
  console.log(indent + `step: ${step.name}`);
  for (const cmd of step.commands) {
    const indent = " ".repeat(4);
    try {
      const res = await exec(cmd);
      console.log(green(indent + cmd));
      if (ctx.verbose) log.debug("\n" + res);
    } catch (err) {
      if (step.try_catch) {
        console.log(yellow(indent + cmd));
        if (ctx.verbose) log.warn("\n" + err);
        return err;
      } else {
        console.log(red(indent + cmd));
        if (ctx.verbose) log.error("\n" + err);
        throw null;
      }
    }
  }
};
const execPipeline = async (pipeline: Pipeline) => {
  const indent = " ".repeat(0);
  console.log(indent + `pipeline: ${pipeline.name}`);
  for (const step of pipeline.steps) {
    await execStep(step);
  }
};
