import simpleGit, { SimpleGit, CleanOptions } from "simple-git";

const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);

export const getBranch = async () => {
  const name = git.revparse(["--abbrev-ref HEAD"]);
  return name;
};

export const getGitPath = async () => {
  const path = await git.revparse(["--show-toplevel"]);
  return path;
};
