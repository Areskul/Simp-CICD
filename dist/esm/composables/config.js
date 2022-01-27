import { log } from "@composables/logger";
let store = {};
const useConfig = () => ({
    defineConfig,
    set,
    get
});
const set = async (config) => {
    try {
        store.config = config;
        return;
    }
    catch (err) {
        log.error(err);
        return;
    }
};
const get = () => {
    return store.config;
};
const defineConfig = (config) => {
    return config;
};
export { useConfig };
//# sourceMappingURL=config.js.map