const { defineConfig } = require("simpcicd");

const app_name = "theeevent";
const suffix = "front";
const version = "nightly";

const nightlyConfig = defineConfig({
  pipelines: [
    {
      name: "nightly",
      steps: [
        {
          name: "build",
          commands: ["yarn", "yarn build"]
        },
        {
          name: "loacl install",
          commands: ["npm i -g"]
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
