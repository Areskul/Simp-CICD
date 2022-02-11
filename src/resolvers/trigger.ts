import { log } from "@composables/logger";
import { useExec } from "@composables/exec";
import type { Config, Pipeline } from "@type/index";
import { getBranch } from "@utils/git";
type Args = {
  name?: string;
  config: Config;
};

export const useTrigger = (config: Config) => {
  const { execPipeline } = useExec();

  const trigger = async (name?: string) => {
    const n = name ? name : "default";
    const hasName = await reducerName({ name: n, config: config });
    const hasBranch = await reducerBranch({ name: n, config: hasName });
    for (const pipeline of hasBranch.pipelines) {
      try {
        await execPipeline(pipeline);
      } catch (err) {
        return err;
      }
    }
  };

  const bulkTrigger = async () => {
    const hasBranch = await reducerBranch({ config: config });
    for (const pipeline of hasBranch.pipelines) {
      try {
        await execPipeline(pipeline);
      } catch (err) {
        return err;
      }
    }
  };

  const reducerBranch = async ({ name, config }: Args): Promise<Config> => {
    const n = name ? name : "";
    const actualBranch = await getBranch();
    config.pipelines = config.pipelines.filter((pipeline: Pipeline) =>
      pipeline.trigger.branches.includes(actualBranch)
    );
    if (config.pipelines.length == 0) {
      log.debug(`checkout to permitted branch to triggger pipeline ${n}`);
    }
    return config;
  };
  const reducerName = async ({ name, config }: Args): Promise<Config> => {
    const n = name ? name : "";
    config.pipelines = config.pipelines.filter(
      (pipeline: Pipeline) => pipeline.name == n
    );
    if (config.pipelines.length == 0) {
      log.debug(`couldn't find pipeline "${n}"`);
    }
    return config;
  };
  return {
    trigger,
    bulkTrigger,
    reducerName,
    reducerBranch
  };
};
