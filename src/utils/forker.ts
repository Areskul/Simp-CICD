import cp from "child_process";
import { getGitPath, getBranch } from "@utils/git";
import type { Action } from "@def/types";

interface ForkOptions {
  pipeline?: string;
  action?: Action;
}

export const fork = async (options: ForkOptions) => {
  const gitRoot = await getGitPath();
  const target = `${gitRoot}/node_modules/simpcicd/dist/bin/caller.js`;
  const argv: string[] = [];
  if (!!options.action) {
    argv.push(options?.action as string);
  } else {
    const actualBranch = await getBranch();
    argv.push(actualBranch);
  }
  if (!!options.pipeline) {
    argv.push(options.pipeline);
  }
  const subprocess = cp.spawn(target, argv, {
    // detached: true,
    // stdio: ["ignore", "ignore", "ignore"]
    detached: false,
    stdio: "pipe"
  });
  subprocess.unref();
  return;
};
