import { useHooks } from "@resolvers/hooks";
import { useConfig } from "@composables/config";
import { caller } from "@utils/caller";
const { buildCaller } = useHooks();

const start = async () => {
  await caller(useConfig());
};

start();
// buildCaller();
