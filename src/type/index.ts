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
/**
 * @typedef {object} Trigger - Define a trigger event
 * @property {string} branch - the branch that will trigger the pipe
 * @property {string} branch - the action that will trigger the pipe
 */
interface Trigger {
  branches?: string[];
  actions?: string[];
}

interface ExecContext {
  verbose?: boolean;
}

interface ExecOptions {
  "non-blocking"?: boolean;
}
enum GitHooks {
  "pre-commit",
  // "pre-merge-commit",
  // "prepare-commit-msg",
  // "commit-msg",
  // "post-commit",
  // "pre-rebase",
  // "post-checkout",
  // "post-merge",
  "pre-push",
  "pre-receive",
  "update",
  // "proc-receive",
  "post-receive"
  // "post-update",
  // "pre-auto-gc",
  // "post-rewrite"
}
/**
 * @typedef {string} Action - Define a trigger event
 * @property {string} Action - git actions (hooks) that will trigger the pipe
 */
type Action = keyof typeof GitHooks;

export { Config, Pipeline, Step, ExecOptions, ExecContext, Action };
