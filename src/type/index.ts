interface Config {
  pipelines: Pipeline[];
}
interface Pipeline {
  name: string;
  commands?: string[];
  steps: Step[];
  trigger?: any;
}

enum StepType {
  exec,
  docker
}
type StepTypeString = keyof typeof StepType;

interface Step {
  type?: StepTypeString;
  name: string;
  commands: string[];
}

interface Trigger {
  branch?: string[];
  action?: string[];
}

type ExecOptions = {
  verbose?: boolean | null;
};

type StepOptions = {
  cwd?: string | boolean | null;
};

type TriggerOptions = {
  verbose?: boolean;
};

export { Config, Pipeline, Step, ExecOptions, StepOptions, TriggerOptions };
