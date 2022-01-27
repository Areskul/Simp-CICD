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
    name: string;
    commands: string[];
}
export { Config, Pipeline, Step };
