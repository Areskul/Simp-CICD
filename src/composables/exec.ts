import { log } from "@composables/logger";
import { exec as $ } from "child_process";

export const useExec = () => ({
  exec
});

const exec = async (cmd: string) => {
  await $(cmd, (err, stdout, stderr) => {
    if (err) {
      log.error(err);
    }
    if (!!stdout) {
      log.debug(stdout);
    }
    if (!!stderr) {
      log.warn(stderr);
    }
  });
};
