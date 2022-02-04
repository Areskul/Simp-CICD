import { useExec } from "@composables/exec";

export const getBranch = () => {
  const { exec } = useExec();
  const name = exec("git rev-parse --abbrev-ref HEAD");
  return name;
};
