import type { Config } from "@type/index";
import { log } from "@composables/logger";

interface Store {
  config?: any;
}
let store: Store = {};

const useConfig = () => ({
  defineConfig,
  set,
  get
});

const set = async (config: Config) => {
  if (!!config) {
    try {
      store.config = config;
      return;
    } catch (err) {
      log.error(err);
      return;
    }
  } else {
    // cosmiconfig read json or js route file
    log.info("No Config Object explicitly provided");
    log.info("Fallback to simp.config{.js|.json}");
  }
};
const get = () => {
  return store.config;
};

const defineConfig = (config: Config): Config => {
  return config;
};

export { useConfig };
