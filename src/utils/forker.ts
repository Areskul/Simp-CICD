import cp from "child_process";
import { getGitPath } from "@utils/git";

export const fork = async () => {
  const gitRoot = await getGitPath();
  const target = `${gitRoot}/node_modules/simpcicd/dist/bin/caller.js`;
  const options = { detached: true, silent: true };
  const subprocess = cp.spawn(target, options);
  subprocess.unref();
};
