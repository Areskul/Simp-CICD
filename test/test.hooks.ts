import { useHooks } from "@resolvers/hooks";
import { useConfig } from "@composables/config";

const start = async () => {
  const { buildCaller } = useHooks(useConfig());
  buildCaller();
};

start();
