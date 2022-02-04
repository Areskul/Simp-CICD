import { caller } from "@resolvers/caller";
import { useConfig } from "@composables/config";

const start = async () => {
  await caller(useConfig());
};
start();
