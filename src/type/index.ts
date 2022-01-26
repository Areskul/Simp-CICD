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
export { Config, Pipeline, Step };
