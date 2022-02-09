import { useLogs } from "@composables/logger";
import { execSync as $ } from "child_process";
import { getDuration } from "@utils/perfomance";

import { green, red, blue, yellow } from "picocolors";
import type { Pipeline, Step, ExecOptions } from "@type/index";

export const useExec = () => {
  const exec = async (cmd: string, opts?: ExecOptions) => {
    const { pipelineLog: log } = await useLogs();
    try {
      const res = await $(cmd, {
        stdio: ["ignore", "pipe", "pipe"]
      });
      log.debug(green(cmd));
      log.silly("\n" + res);
      return res;
    } catch (err) {
      if (opts && opts["non-blocking"]) {
        log.warn(yellow(cmd));
        log.warn("\n" + err);
        return err;
      } else {
        log.error(red(cmd));
        log.error("\n" + err);
        throw err;
      }
    }
  };

  const execStep = async (step: Step) => {
    const { pipelineLog: log } = await useLogs();
    const opts: ExecOptions = {
      "non-blocking": !!step["non-blocking"]
    };
    log.info(`step: ${step.name}`);
    if (step["non-blocking"]) {
      log.debug(opts);
    }
    for (const cmd of step.commands) {
      try {
        await exec(cmd, opts);
        // return;
      } catch (err) {
        if (opts["non-blocking"]) {
          // return;
        } else {
          throw null;
        }
      }
    }
  };

  const execPipeline = async (pipeline: Pipeline) => {
    const { pipelineLog: log } = await useLogs();
    log.info(`pipeline: ${pipeline.name}`);
    for (const step of pipeline.steps) {
      await execStep(step);
    }
  };

  return {
    execPipeline,
    execStep,
    exec
  };
};
