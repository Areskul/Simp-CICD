import cp from "child_process";
import { log } from "@composables/logger";
import { getGitPath, getBranch } from "@utils/git";
import type { Action } from "@def/types";

interface ForkOptions {
  action?: Action;
  pipeline?: string;
}

export const fork = async ({ action, pipeline }: ForkOptions) => {
  const gitRoot = await getGitPath();
  const target = `${gitRoot}/node_modules/simpcicd/dist/bin/caller.js`;
  const argv: string[] = [];
  if (!!action) {
    argv.push(action as string);
  }
  if (!!pipeline) {
    const actualBranch = await getBranch();
    argv.push(actualBranch);
    argv.push(pipeline);
  }
  try {
    const subprocess = cp.spawn(target, argv, {
      detached: true,
      stdio: ["ignore", "ignore", "ignore"]
    });
    subprocess.unref();
  } catch (err) {
    log.warn(err);
  }
  return;
};
