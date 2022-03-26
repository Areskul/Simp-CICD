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
          "non-blocking": true,
          commands: [
            "chmod +x dist/bin/*.mjs",
            "chmod +x dist/bin/forker/*.mjs"
          ]
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
export { defaultConfig };
