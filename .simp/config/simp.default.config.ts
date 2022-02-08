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
        branches: ["main", "master", "dev"],
        actions: ["pre-push"]
      }
    }
  ]
};
export { defaultConfig };
