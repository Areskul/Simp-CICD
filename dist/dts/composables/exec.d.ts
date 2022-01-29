import type { Pipeline, Step, ExecOptions } from "@type/index";
export declare const useExec: () => {
    set: (newCtx: ExecOptions) => void;
    execPipeline: (pipeline: Pipeline) => Promise<void>;
    execStep: (step: Step) => Promise<void>;
    exec: (cmd: string) => Promise<void>;
};
