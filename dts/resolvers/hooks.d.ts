import type { Config } from "@type/index";
export declare const useHooks: (conf?: Config | undefined) => {
    caller: () => void;
    generateHook: (name: string) => Promise<unknown>;
    printHooks: () => void;
    build: () => Promise<void>;
    generateOutputs: (bundle: any) => Promise<void>;
};
