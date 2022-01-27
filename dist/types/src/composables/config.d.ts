import type { Config } from "@type/index";
declare const useConfig: () => {
    defineConfig: (config: Config) => Config;
    set: (config: Config) => Promise<void>;
    get: () => any;
};
export { useConfig };
//# sourceMappingURL=config.d.ts.map