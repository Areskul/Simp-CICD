const defaultConfig = {
  pipelines: [
    {
      name: "default",
      steps: [
        {
          name: "test out",
          commands: ["ls"]
        },
        {
          name: "pre-build",
          commands: ["rm -rf dist/*", "rm -rf cli/*"]
        },
        {
          name: "build",
          commands: ["yarn", "yarn build"]
        }
        // {
        //   name: "patch",
        //   commands: ["yarn version --patch"]
        // }
      ],
      trigger: {
        branch: ["main", "master", "dev"],
        action: ["push"]
      }
    }
  ]
};
module.exports = defaultConfig;
