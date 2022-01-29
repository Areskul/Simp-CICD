import type { Config } from "../src/type/index";

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
