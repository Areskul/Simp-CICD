import { log } from "@composables/logger";
import { $ } from "zx";

export const useDocker = () => ({
  dockerize
});
interface dockerArgs {
  name: string;
  image: string;
}
const dockerize = async ({ name, image }: dockerArgs) => {
  try {
    await $`docker container create --name=${name} ${image}`;
  } catch (err) {
    log.error(err);
  }
};
