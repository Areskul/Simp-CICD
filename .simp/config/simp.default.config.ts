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
          commands: ["chmod +x dist/bin/*.js"]
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
