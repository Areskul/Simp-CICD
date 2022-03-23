import type { Config, Pipeline, Action } from "@def/types";
import { log } from "@composables/logger";
// import { lilconfig } from "lilconfig";
// import { TypeScriptLoader } from "@sliphua/lilconfig-ts-loader";
import { cosmiconfig } from "cosmiconfig";
import TypeScriptLoader from "@endemolshinegroup/cosmiconfig-typescript-loader";
import { uniq } from "lodash";
import { getBranch } from "@utils/git";

interface Store {
  config: Config;
}

const useConfig = async (config?: Config) => {
  const store: Store = { config: {} as Config };
  const options = {
    searchPlaces: ["simp.config.ts", "simp.config.js", "simp.config.mjs"],
    loaders: {
      ".ts": TypeScriptLoader,
      ".mjs": TypeScriptLoader
    }
  };
  const set = async (config?: Config) => {
    if (!!config) {
      store.config = config;
      return store.config;
    }
    try {
      const res = await cosmiconfig("simp", options).search();
      const config = res!.config as Config;
      store.config = config;
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
