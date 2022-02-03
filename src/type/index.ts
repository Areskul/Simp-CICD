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
enum GitHooks {
  "pre-commit",
  "pre-merge-commit",
  "prepare-commit-msg",
  "commit-msg",
  "post-commit",
  "pre-rebase",
  "post-checkout",
  "post-merge",
  "pre-push",
  "pre-receive",
  "update",
  "proc-receive",
  "post-receive",
  "post-update",
  "pre-auto-gc",
  "post-rewrite"
}
type Action = keyof typeof GitHooks;

export { Config, Pipeline, Step, ExecOptions, ExecContext, Action };
