import { useConfig, call } from "../cjs/index.js";
const action = process.argv[2];
const start = async () => {
  const config = await useConfig();
  call({ config: config, action: action });
};
start();
