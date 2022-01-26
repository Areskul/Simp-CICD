import { cosmiconfig } from "cosmiconfig";
import type { Config } from "@type/index";
import { log } from "@composables/logger";
export const useConfig = async () => {
  try {
    const res = await cosmiconfig("simp").search();
    const config = res!.config;
    return config;
  } catch (err) {
    log.error(err);
    return err;
  }
};

export const defineConfig = (config: Config) => {
  return config;
};
