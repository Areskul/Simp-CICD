import { log } from "@composables/logger";

interface Config {
  pipelines: Pipeline[];
}
interface Pipeline {
  name: string;
  commands?: string[];
  steps: Step[];
  trigger?: Trigger;
}

interface Step {
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
  actions?: Action[];
}

interface ExecContext {
  verbose?: boolean;
}

interface ExecOptions {
  "non-blocking"?: boolean;
}
const GitHooks = [
  "pre-commit",
  "pre-push",
  "pre-receive",
  "update",
  "post-receive"
];
/**
 * @typedef {string} Action - Define a trigger event
 * @property {string} Action - git actions (hooks) that will trigger the pipe
 */
type Action =
  | "pre-commit"
  | "pre-push"
  | "pre-receive"
  | "update"
  | "post-receive";

export { Config, Pipeline, Step, ExecOptions, ExecContext, Action };
