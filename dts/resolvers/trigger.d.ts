import type { Config } from "@type/index";
export declare const useTrigger: (conf?: Config | undefined) => {
    trigger: (name: string) => Promise<unknown>;
};
