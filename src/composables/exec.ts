import { initLogs, useLogs } from "@composables/logger";
import { execSync as $ } from "child_process";
import { getDuration } from "@utils/perfomance";

import { green, red, blue, yellow } from "picocolors";
import type { Pipeline, Step, ExecOptions } from "@type/index";

export const useExec = () => {
  const exec = async (cmd: string, opts?: ExecOptions) => {
    const { pipelineLog: log, verbose } = await useLogs();
    try {
      const res = await $(cmd, {
        stdio: ["ignore", "pipe", "pipe"]
      });
      log.debug(green(cmd));
      log.trace("\n" + res);
      return res;
    } catch (err) {
      if (opts && opts["non-blocking"]) {
        log.warn(yellow(cmd));
        log.trace("\n" + err);
        return err;
      } else {
        log.warn(red(cmd));
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
    if (step["non-blocking"]) {
      log.info(`non-blocking step: ${step.name}`);
    } else {
      log.info(`step: ${step.name}`);
    }
    log.debug(opts);
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
    await initLogs();
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
