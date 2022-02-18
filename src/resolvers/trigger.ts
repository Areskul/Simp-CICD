import { log } from "@composables/logger";
import { useExec } from "@composables/exec";
import type { Config, Pipeline, Action } from "@def/types";
import { getBranch } from "@utils/git";
import { fork } from "@utils/forker";
export const useTrigger = (config: Config) => {
  const { execPipeline } = useExec();

  const trigger = async (name?: string, options?: any) => {
    const n = name ? name : "default";
    const hasName = await reducerName({ name: n, config: config });
    const hasBranch = await reducerBranch({ name: n, config: hasName });
    for (const pipeline of hasBranch.pipelines) {
      try {
        if (options.spawn) {
          fork({ pipeline: n });
        }
        await execPipeline(pipeline);
      } catch (err) {
        return err;
      }
    }
  };

  const bulkTrigger = async (action: Action) => {
    const hasBranch = await reducerBranch({ config: config });
    const hasAction = await reducerAction({
      action: action,
      config: hasBranch
    });
    for (const pipeline of hasAction.pipelines) {
      try {
        await execPipeline(pipeline);
      } catch (err) {
        return err;
      }
    }
  };

  type reducerArgs = {
    name?: string;
    config: Config;
  };

  const reducerName = async ({
    name,
    config
  }: reducerArgs): Promise<Config> => {
    config.pipelines = config.pipelines.filter(
      (pipeline: Pipeline) => pipeline.name == name
    );
    if (config.pipelines.length == 0) {
      log.debug(`couldn't find pipeline "${name}"`);
    }
    return config;
  };

  const reducerBranch = async ({
    name,
    config
  }: reducerArgs): Promise<Config> => {
    const actualBranch = await getBranch();
    config.pipelines = config.pipelines.filter((pipeline: Pipeline) =>
      pipeline.trigger?.branches?.includes(actualBranch)
    );
    if (config.pipelines.length == 0) {
      log.debug(`checkout to permitted branch to triggger pipeline ${name}`);
    }
    return config;
  };

  type reducerActionArgs = {
    action: Action;
    config: Config;
  };
  const reducerAction = async ({
    action,
    config
  }: reducerActionArgs): Promise<Config> => {
    config.pipelines = config.pipelines.filter((pipeline: Pipeline) =>
      pipeline.trigger?.actions?.includes(action)
    );
    return config;
  };
  return {
    trigger,
    bulkTrigger,
    reducerName,
    reducerBranch
  };
};
