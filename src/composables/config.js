"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfig = void 0;
const logger_1 = require("@composables/logger");
let store = {};
const useConfig = () => ({
    defineConfig,
    set,
    get
});
exports.useConfig = useConfig;
const set = async (config) => {
    try {
        store.config = config;
        return;
    }
    catch (err) {
        logger_1.log.error(err);
        return;
    }
};
const get = () => {
    return store.config;
};
const defineConfig = (config) => {
    return config;
};
//# sourceMappingURL=config.js.map