import { execSync as $ } from "child_process";
import { log } from "@composables/logger";

export const useDocker = () => ({
  dockerize,
  undockerize
});
interface dockerArgs {
  name: string;
  image?: string;
}
const dockerize = async ({ name, image }: dockerArgs) => {
  try {
    await $(`docker container create --name=${name} ${image}`);
    await $(`docker container start ${name}`);
  } catch (err) {
    log.error(err);
  }
};

const undockerize = async ({ name }: dockerArgs) => {
  try {
    await $(`docker container stop ${name}`);
    await $(`docker container rm ${name}`);
  } catch (err) {
    console.log(err);
  }
};
