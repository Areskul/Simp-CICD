import { useCli, useConfig } from "../esm/index.mjs";
const start = async () => {
  const config = await useConfig();
  await useCli(config);
};
start();
