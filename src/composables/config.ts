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
  try {
    store.config = config;
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

export { useConfig };
