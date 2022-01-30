import type { Config } from "@type/index";
declare const useConfig: () => {
    defineConfig: (config: Config) => Config;
    set: () => Promise<void>;
    get: () => any;
};
declare const defineConfig: (config: Config) => Config;
export { useConfig, defineConfig };
