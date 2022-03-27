import { useCli, useConfig } from "../esm/index.js";
const start = async () => {
  const config = await useConfig();
  await useCli(config);
};
start();
