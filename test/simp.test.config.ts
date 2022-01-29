import type { Config } from "simpcicd";

const config: Config = {
  pipelines: [
    {
      name: "cdtest",
      steps: [
        {
          name: "cd",
          commands: ["ls ./"]
        }
      ]
    }
  ]
};
export default config;
