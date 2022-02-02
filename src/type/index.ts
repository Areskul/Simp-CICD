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
  "non-blocking"?: boolean;
  name: string;
  commands: string[];
}

interface Trigger {
  branch?: string[];
  action?: string[];
}

interface ExecContext {
  verbose?: boolean;
}

interface ExecOptions {
  "non-blocking"?: boolean;
}

export { Config, Pipeline, Step, ExecOptions, ExecContext };
