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
    try_catch?: boolean;
    name: string;
    commands: string[];
}
declare type ExecOptions = {
    verbose?: boolean | null;
};
declare type TriggerOptions = {
    verbose?: boolean;
};
export { Config, Pipeline, Step, ExecOptions, TriggerOptions };
