import fs from "fs";
import { log } from "@composables/logger";

const mkdir = (path: string) => {
  fs.mkdir(path, { mode: 0o0755, recursive: true }, (err: any) => {
    if (err) {
      log.error(err);
      return err;
    }
    return;
  });
};
type lnArgs = {
  target: string;
  path: string;
};

const ln = ({ target, path }: lnArgs) => {
  fs.symlink(target, path, (err: any) => {
    if (err) {
      log.error(err);
      return err;
    }
    return;
  });
};

const unln = (target: string) => {
  fs.unlink(target, (err: any) => {
    if (err) {
      log.error(err);
      return err;
    }
    return;
  });
};

const makeFileTree = () => {
  const directories = [
    ".simp/hooks/src/pre-push",
    ".simp/config",
    ".simp/logs"
  ];
  for (const path of directories) {
    mkdir(path);
  }
};

export const useFs = () => ({
  makeFileTree,
  mkdir,
  ln,
  unln
});
