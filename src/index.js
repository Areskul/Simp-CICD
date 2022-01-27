"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSimp = void 0;
const cli_1 = require("@composables/cli");
const picocolors_1 = require("picocolors");
const useSimp = (config) => {
    console.log((0, picocolors_1.blue)("SimpCICD"));
    const cli = (0, cli_1.useCli)(config);
    return cli;
};
exports.useSimp = useSimp;
//# sourceMappingURL=index.js.map