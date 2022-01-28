"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocker = void 0;
const child_process_1 = require("child_process");
const logger_1 = require("@composables/logger");
const useDocker = () => ({
    dockerize,
    undockerize
});
exports.useDocker = useDocker;
const dockerize = async ({ name, image }) => {
    try {
        await (0, child_process_1.execSync)(`docker container create --name=${name} ${image}`);
        await (0, child_process_1.execSync)(`docker container start ${name}`);
    }
    catch (err) {
        logger_1.log.error(err);
    }
};
const undockerize = async ({ name }) => {
    try {
        await (0, child_process_1.execSync)(`docker container stop ${name}`);
        await (0, child_process_1.execSync)(`docker container rm ${name}`);
    }
    catch (err) {
        console.log(err);
    }
};
//# sourceMappingURL=docker.js.map