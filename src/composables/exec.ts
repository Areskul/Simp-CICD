import { $ } from "zx";
import { log } from "@composables/logger";

export const useExec = () => ({
  exec
});

const exec = async (cmd: string) => {
  await $`${cmd}`;
};
