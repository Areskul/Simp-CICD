import { log } from "@composables/logger";
import { execSync as $ } from "child_process";
import { getDuration } from "@utils/perfomance";

import { green, red, blue, yellow } from "picocolors";
import type { Pipeline, Step, ExecOptions, ExecContext } from "@type/index";

let store: ExecContext = {
  verbose: false
};

export const useExec = (ctx?: ExecContext) => {
  const setContext = (ctx: ExecContext) => {
    store = ctx;
    log.debug(store);
  };

  const exec = async (cmd: string, opts?: ExecOptions) => {
    try {
      const res = await $(cmd, {
        stdio: ["ignore", "pipe", "pipe"]
      });
      log.debug(green(cmd));
      if (store.verbose) log.debug("\n" + res);
      return res;
    } catch (err) {
      if (opts && opts["non-blocking"]) {
        log.warn(yellow(cmd));
        if (store.verbose) log.warn("\n" + err);
        return err;
      } else {
        log.error(red(cmd));
        if (store.verbose) log.error("\n" + err);
        throw err;
      }
    }
  };

  const execStep = async (step: Step) => {
    const opts: ExecOptions = {
      "non-blocking": !!step["non-blocking"]
    };
    log.info(`step: ${step.name}`);
    if (step["non-blocking"]) {
      if (store.verbose) log.debug(opts);
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
    log.info(`pipeline: ${pipeline.name}`);
    for (const step of pipeline.steps) {
      await execStep(step);
    }
  };

  return {
    setContext,
    execPipeline,
    execStep,
    exec
  };
};
