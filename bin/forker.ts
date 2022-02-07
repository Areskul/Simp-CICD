import { fork, getGitPath } from "../cjs/index.js";
const start = async () => {
  const gitRoot = await getGitPath();
  const target = `${gitRoot}/node_modules/simpcicd/dist/bin/caller.js`;
  fork(target);
};
start();
