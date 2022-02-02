import type { Config } from "@type/index";
declare const useConfig: (config?: Config | undefined) => Config;
declare const defineConfig: (config: Config) => Config;
export { useConfig, defineConfig, Config };
