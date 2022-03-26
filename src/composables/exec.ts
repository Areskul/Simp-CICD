import { initLogs, useLogs } from "@composables/logger";
import { execSync as $ } from "child_process";
import { getDuration } from "@utils/perfomance";
import { getBranch } from "@utils/git";
import pc from "picocolors";
import type { Pipeline, Step, ExecOptions } from "@def/types";

export const useExec = () => {
  const exec = async (cmd: string, opts?: ExecOptions) => {
    const {
      pipelineLog: log,
      defaultLog,
      fileLog: flog,
      verbose
    } = await useLogs();
    try {
      const res = await $(cmd, {
        stdio: ["ignore", "pipe", "pipe"]
      });
      log.debug(pc.green(cmd));
      if (verbose.get()) defaultLog.trace("\n" + res);
      flog.trace("\n" + res);
      return res;
    } catch (err) {
      if (opts && opts["non-blocking"]) {
        log.warn(pc.red(cmd));
        log.trace("\n" + err);
        return err;
      } else {
        log.warn(pc.red(cmd));
        if (verbose.get()) defaultLog.error("\n" + err);
        flog.error("\n" + err);
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
      log.silly(`non-blocking step: ${step.name}`);
    } else {
      log.silly(`step: ${step.name}`);
    }
    for (const cmd of step.commands) {
      try {
        await exec(cmd, opts);
      } catch (err) {
        if (opts["non-blocking"]) {
          return;
        } else {
          throw null;
        }
      }
    }
  };

  const execPipeline = async (pipeline: Pipeline) => {
    await initLogs();
    const { pipelineLog: log } = await useLogs();
    const branch = await getBranch();
    log.info(`branch: ${branch}`);
    log.silly(`pipeline: ${pipeline.name}`);
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
