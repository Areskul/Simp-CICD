import cp from "child_process";
import { getGitPath } from "@utils/git";

export const forkPush = async () => {
  const gitRoot = await getGitPath();
  const action = "pre-push";
  const target = `${gitRoot}/node_modules/simpcicd/dist/bin/caller.js`;
  const subprocess = cp.spawn(target, [action], {
    detached: true,
    stdio: ["ignore", "ignore", "ignore"]
  });
  subprocess.unref();
  return;
};
