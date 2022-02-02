import { useExec } from "@composables/exec";

const { exec } = useExec();
export const getBranch = () => {
  const name = exec("git rev-parse --abbrev-ref HEAD");
  return name;
};
