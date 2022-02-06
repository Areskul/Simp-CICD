import cp from "child_process";

export const fork = () => {
  const options = { detached: true, silent: true };
  const subprocess = cp.spawn("dist/cjs/caller.js", options);
  subprocess.unref();
};
