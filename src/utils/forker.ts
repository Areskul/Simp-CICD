import cp from "child_process";
import { getGitPath } from "@utils/git";
import type { Action } from "@type/index";

export const fork = async (action: Action) => {
  const gitRoot = await getGitPath();
  const target = `${gitRoot}/node_modules/simpcicd/dist/bin/caller.js`;
  const subprocess = cp.spawn(target, [action], {
    detached: true,
    stdio: ["ignore", "ignore", "ignore"]
  });
  subprocess.unref();
  return;
};
