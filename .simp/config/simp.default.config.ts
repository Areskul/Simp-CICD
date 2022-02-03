const defaultConfig = {
  pipelines: [
    {
      name: "default",
      steps: [
        {
          name: "test out",
          commands: ["lls -a", "ls"],
          "non-blocking": true
        },
        {
          name: "pre-build",
          commands: ["rm -rf dist/*", "rm -rf cli/*"]
        },
        {
          name: "test2",
          commands: ["lls -a", "ls"]
        },
        {
          name: "build",
          commands: ["yarn", "yarn build"]
        }
      ],
      trigger: {
        branch: ["main", "master", "dev"],
        action: ["pre-push"]
      }
    }
  ]
};
export { defaultConfig };
