import { cosmiconfig } from "cosmiconfig";
import TypeScriptLoader from "cosmiconfig-typescript-loader";
import type { Config } from "@type/index";
import { log } from "@composables/logger";

const useConfig = async () => {
  const moduleName = "simp";
  const explorer = cosmiconfig(moduleName, {
    searchPlaces: [
      "package.json",
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `.${moduleName}rc.ts`,
      `${moduleName}.config.js`,
      `${moduleName}.config.ts`,
      `${moduleName}.nightly.config.ts`,
      `${moduleName}.production.config.js`,
      `${moduleName}.stagging.config.js`
    ],
    loaders: {
      ".ts": TypeScriptLoader()
    }
  });
  try {
    const res = await explorer.search();
    if (res) {
      log.debug(res);
      const config = res.config;
      return config;
    }
  } catch (err) {
    log.error(err);
    return err;
  }
};

const defineConfig = (config: Config) => {
  return config;
};

export { defineConfig, useConfig };
