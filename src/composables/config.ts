import { cosmiconfig } from "cosmiconfig";
import { log } from "@composables/logger";
export const useConfig = async () => {
  try {
    const res = await cosmiconfig("simp").search();
    const config = res!.config;
    log.debug(config);
    return config;
  } catch (err) {
    log.error(err);
    return err;
  }
};
