import type { Config } from "@type/index";
import { log } from "@composables/logger";
import { lilconfig } from "lilconfig";

interface Store {
  config: Config;
}
let store: Store;

const useConfig = (config?: Config) => {
  set(config);
  return store.config;
};

const set = async (config?: Config) => {
  if (config) {
    store.config = config;
    return store.config;
  }
  try {
    let config: Config;
    const options = {
      searchPlaces: ["simp.config.js"]
    };
    const res = await lilconfig("simp", options).search();
    if (res) {
      config = res!.config;
      store.config = config;
    }
    return store.config;
  } catch (err) {
    log.error(err);
    return;
  }
};

const defineConfig = (config: Config): Config => {
  return config;
};

export { useConfig, defineConfig, Config };
