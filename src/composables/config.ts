import type { Config, Action } from "@def/types";
import { log } from "@composables/logger";
import { lilconfig } from "lilconfig";
import { TypeScriptLoader } from "@sliphua/lilconfig-ts-loader";
import { uniq } from "lodash";

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
      let config: Config;
      const options = {
        searchPlaces: ["simp.config.ts", "simp.config.js", "simp.config.mjs"],
        loaders: {
          ".ts": TypeScriptLoader,
          ".mjs": TypeScriptLoader
        }
      };
      const res = await lilconfig("simp", options).search();
      if (res) {
        const config = res.config;
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

export { useConfig, defineConfig, Config, getActions };
