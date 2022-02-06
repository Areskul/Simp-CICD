import cp from "child_process";

export const fork = (path: string) => {
  const options = { detached: true, silent: true };
  const subprocess = cp.spawn(path, options);
  subprocess.unref();
};
