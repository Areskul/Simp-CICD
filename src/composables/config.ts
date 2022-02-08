import type { Config, Action } from "@type/index";
import { log } from "@composables/logger";
import { lilconfigSync } from "lilconfig";
import { TypeScriptLoader } from "@sliphua/lilconfig-ts-loader";
import { uniq } from "lodash";

interface Store {
  config: Config;
}

const useConfig = (config?: Config) => {
  const store: Store = { config: {} as Config };
  const set = (config?: Config) => {
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
      const res = lilconfigSync("simp", options).search();
      if (res) {
        config = res.config;
        store.config = config;
      }
      return store.config;
    } catch (err) {
      log.error(err);
      return;
    }
  };
  set(config);
  return store.config;
};

const defineConfig = (config: Config): Config => {
  return config;
};

const getActions = (config: Config): Action[] => {
  let actions: Action[] = [];
  for (const pipeline of config.pipelines) {
    actions = actions.concat(pipeline.trigger.actions);
  }
  actions = uniq(actions);
  return actions;
};

export { useConfig, defineConfig, Config, getActions };
