import { useCli, useConfig } from "../cjs/index.js";
const start = async () => {
  const config = await useConfig();
  useCli(config);
};
start();
