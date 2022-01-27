import type { Pipeline, Step } from "@type/index";
export declare const useExec: () => {
    execPipeline: (pipeline: Pipeline) => Promise<void>;
    execStep: (step: Step) => Promise<void>;
    exec: (cmd: string) => Promise<void>;
};
