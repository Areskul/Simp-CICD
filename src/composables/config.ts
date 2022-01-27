import type { Config } from "@type/index";
import { log } from "@composables/logger";

const useConfig = async (filePath?: string) => {
  try {
    const path = filePath ? filePath : "@/../simp.config";
    const config = require(path);
    return config;
  } catch (err) {
    log.error(err);
    return;
  }
};

const defineConfig = (config: Config): Config => {
  return config;
};

export { defineConfig, useConfig };
