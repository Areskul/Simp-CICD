const app_name = "theeevent";
const suffix = "front";
const version = "nightly";
const nightlyConfig = {
    pipelines: [
        {
            name: "nightly",
            steps: [
                {
                    type: "exec",
                    name: "install",
                    commands: ["yarn", "yarn build"]
                },
                {
                    type: "exec",
                    name: `image:${version}`,
                    commands: [
                        "cd dist",
                        `docker build -t ${app_name}/${suffix}:${version} .`,
                        "cd .."
                    ]
                }
            ],
            trigger: {
                branch: ["main", "master", "dev"],
                action: ["push"]
            }
        }
    ]
};
export { nightlyConfig };
//# sourceMappingURL=simp.nightly.config.js.map