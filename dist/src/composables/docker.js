import { execSync as $ } from "child_process";
import { log } from "@composables/logger";
export const useDocker = () => ({
    dockerize,
    undockerize
});
const dockerize = async ({ name, image }) => {
    try {
        await $(`docker container create --name=${name} ${image}`);
        await $(`docker container start ${name}`);
    }
    catch (err) {
        log.error(err);
    }
};
const undockerize = async ({ name }) => {
    try {
        await $(`docker container stop ${name}`);
        await $(`docker container rm ${name}`);
    }
    catch (err) {
        console.log(err);
    }
};
//# sourceMappingURL=docker.js.map