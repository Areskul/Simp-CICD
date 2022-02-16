import { useCli } from "@resolvers/cli";
import { useConfig } from "@composables/config";
const start = async () => {
  const config = await useConfig();
  useCli(config);
};
start();
