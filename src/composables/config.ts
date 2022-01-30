import type { Config } from "@type/index";
import { log } from "@composables/logger";
import { lilconfig } from "lilconfig";
import tsloader from "cosmiconfig-typescript-loader";

interface Store {
  config?: any;
}
const store: Store = {};

const useConfig = () => ({
  defineConfig,
  set,
  get
});

const set = async () => {
  try {
    let config: any = null;
    const options = {
      searchPlaces: ["simp.config.js", "simp.config.ts"],
      loaders: {
        ".ts": tsloader()
      }
    };
    const res = await lilconfig("simp", options).search();
    if (res) {
      config = res!.config;
      store.config = config;
    }
    return;
  } catch (err) {
    log.error(err);
    return;
  }
};
const get = () => {
  return store.config;
};

const defineConfig = (config: Config): Config => {
  return config;
};

export { useConfig, defineConfig };
