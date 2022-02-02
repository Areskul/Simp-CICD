import { useExec } from "@composables/exec";
const { exec } = useExec();
export const setFileTree = () => {
  const directories = [".simp/hooks/src", ".simp/config", ".simp/logs"];
  for (const path of directories) {
    exec(`mkdir -p ${path}`);
  }
};
