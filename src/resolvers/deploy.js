"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const config_1 = require("@composables/config");
const exec_1 = require("@composables/exec");
const { execPipeline } = (0, exec_1.useExec)();
const config = (0, config_1.useConfig)();
const deploy = async () => {
    const conf = config.get();
    if (!conf)
        return;
    for (const pipeline of conf.pipelines) {
        try {
            await execPipeline(pipeline);
        }
        catch (err) {
            return err;
        }
    }
};
exports.deploy = deploy;
//# sourceMappingURL=deploy.js.map