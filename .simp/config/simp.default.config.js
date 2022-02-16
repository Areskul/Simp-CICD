"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
const defaultConfig = {
    pipelines: [
        {
            name: "default",
            steps: [
                {
                    name: "pre-build",
                    commands: ["rm -rf dist/*"]
                },
                {
                    name: "build",
                    commands: ["yarn", "yarn build"]
                },
                {
                    name: "bin files mode",
                    commands: ["chmod +x dist/bin/*.js", "chmod +x dist/bin/forker/*.js"]
                }
            ],
            trigger: {
                branches: ["main", "master"],
                actions: ["pre-push"]
            }
        },
        {
            name: "default",
            steps: [
                {
                    name: "linting",
                    commands: ["yarn lint"]
                }
            ],
            trigger: {
                branches: ["dev"],
                actions: ["pre-push"]
            }
        }
    ]
};
exports.defaultConfig = defaultConfig;
//# sourceMappingURL=simp.default.config.js.map