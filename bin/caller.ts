import { useConfig, call } from "../esm/index.js";
const action = process.argv[2];
const pipeline = process.argv[3];
const start = async () => {
  const config = await useConfig();
  call({ config: config, action: action, pipeline: pipeline });
};
start();
