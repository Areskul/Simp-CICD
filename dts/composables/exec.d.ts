import type { Pipeline, Step, ExecOptions, ExecContext } from "@type/index";
export declare const useExec: (ctx?: ExecContext | undefined) => {
    setContext: (ctx: ExecContext) => void;
    execPipeline: (pipeline: Pipeline) => Promise<void>;
    execStep: (step: Step) => Promise<void>;
    exec: (cmd: string, opts?: ExecOptions | undefined) => Promise<unknown>;
};
