const { defineConfig } = require("simpcicd");

const nightlyConfig = defineConfig({
  pipelines: [
    {
      name: "nightly",
      steps: [
        {
          name: "pre-build",
          commands: ["rm -rf dist/*", "rm -rf cli/*"]
        },
        {
          name: "build",
          commands: ["yarn", "yarn build"]
        }
      ],
      trigger: {
        branch: ["main", "master", "dev"],
        action: ["push"]
      }
    }
  ]
});
module.exports = nightlyConfig;
