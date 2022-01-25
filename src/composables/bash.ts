import { $ } from "zx";
import { log } from "@composables/logger";

export const useBash = () => ({
  bash
});

const bash = async (cmd: string) => {
  await $`${cmd}`;
};
