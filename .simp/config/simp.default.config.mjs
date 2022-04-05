import { defineConfig } from "../../node_modules/simpcicd";
const defaultConfig = defineConfig({
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
          commands: ["chmod +x dist/bin/*.js", "chmod +x dist/bin/forker/*.js"]
        },
        {
          name: "explicit esm",
          commands: ["cp public/package.json dist"]
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
});
export { defaultConfig };
