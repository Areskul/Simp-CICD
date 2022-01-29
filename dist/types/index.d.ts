import * as cac from 'cac';

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

declare const useSimp: (config: Config) => cac.CAC;

export { useSimp };
