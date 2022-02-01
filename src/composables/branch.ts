import { useExec } from "@composables/exec";

const { exec } = useExec();
const getBranch = () => {
  const name = exec("git rev-parse --abbrev-ref HEAD");
  return name;
};
