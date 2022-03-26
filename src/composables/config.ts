import type { Config, Pipeline, Action } from "@def/types";
import { cwd } from "process";
import { log } from "@composables/logger";
import { uniq } from "lodash";
import { getBranch } from "@utils/git";
import Fs from "@supercharge/fs";

interface Store {
  config: Config;
}

const useConfig = async (config?: Config) => {
  const store: Store = { config: {} as Config };
  const set = async (config?: Config) => {
    if (!!config) {
      store.config = config;
      return store.config;
    }
    try {
      const jsPath = `${cwd()}/simp.config.js`;
      const tsPath = `${cwd()}/simp.config.ts`;
      const tsConfig = await Fs.exists(tsPath);
      const jsConfig = await Fs.exists(jsPath);
      let file = null;
      if (jsConfig) {
        file = await require(jsPath);
      }
      if (tsConfig) {
        file = await require(tsPath);
      } else {
        log.error(
          "no config file provided on project root (simp.config.js or simp.config.ts)"
        );
        return;
      }
      if (file) {
        const config = file.default;
        store.config = config;
      }
      return store.config;
    } catch (err) {
      log.error(err);
      return;
    }
  };
  await set(config);
  return store.config;
};

const defineConfig = (config: Config): Config => {
  return config;
};

const getActions = (config: Config): Action[] => {
  let actions: Action[] = [];
  for (const pipeline of config.pipelines) {
    if (!!pipeline.trigger?.actions) {
      actions = actions.concat(pipeline.trigger?.actions);
    }
  }
  actions = uniq(actions);
  return actions;
};

type reducerArgs = {
  name?: string;
  config: Config;
};
const reducerName = async ({ name, config }: reducerArgs): Promise<Config> => {
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
    log.debug(`checkout to permitted branch to trigger pipeline ${name}`);
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
export {
  useConfig,
  defineConfig,
  Config,
  getActions,
  reducerName,
  reducerAction,
  reducerBranch
};
