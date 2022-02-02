import type { Config } from "@type/index";
export declare const useTrigger: (config: Config) => {
    trigger: (name: string) => Promise<unknown>;
};
