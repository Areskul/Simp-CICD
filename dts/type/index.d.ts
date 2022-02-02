interface Config {
    pipelines: Pipeline[];
}
interface Pipeline {
    name: string;
    commands?: string[];
    steps: Step[];
    trigger?: any;
}
declare enum StepType {
    exec = 0,
    docker = 1
}
declare type StepTypeString = keyof typeof StepType;
interface Step {
    type?: StepTypeString;
    "non-blocking"?: boolean;
    name: string;
    commands: string[];
}
interface ExecContext {
    verbose?: boolean;
}
interface ExecOptions {
    "non-blocking"?: boolean;
}
export { Config, Pipeline, Step, ExecOptions, ExecContext };
