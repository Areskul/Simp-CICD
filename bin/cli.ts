import { useCli, useConfig } from "../cjs/index.js";
const start = async () => {
  const config = await useConfig();
  await useCli(config);
};
start();
