import type { Config } from "@type/index";
import { log } from "@composables/logger";
import { lilconfigSync } from "lilconfig";

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
        searchPlaces: ["simp.config.js"]
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

export { useConfig, defineConfig, Config };
