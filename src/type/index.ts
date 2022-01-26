export interface Config {
  pipelines: Pipeline[];
}

interface Pipeline {
  name: string;
  commands?: string[];
  steps?: Step[];
  trigger?: any;
}

interface Step {
  type?: StepType;
  name?: string;
  commands?: string[];
}

enum StepType {
  exec = "exec",
  docker = "docker"
}

interface Trigger {
  branch?: string[];
  action?: string[];
}
