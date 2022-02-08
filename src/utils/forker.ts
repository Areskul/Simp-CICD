import cp from "child_process";
import { getGitPath } from "@utils/git";

export const fork = async () => {
  const gitRoot = await getGitPath();
  const target = `${gitRoot}/node_modules/simpcicd/dist/bin/caller.js`;
  const subprocess = cp.spawn(target, [], {
    detached: true,
    stdio: ["ignore", "ignore", "ignore"]
  });
  subprocess.unref();
  return;
};
