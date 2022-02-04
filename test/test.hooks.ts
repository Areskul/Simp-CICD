import { useHooks } from "@resolvers/hooks";
import { useConfig } from "@composables/config";
import { caller } from "@resolvers/caller";
const { buildCaller } = useHooks();

import { fork } from "child_process";

const start = async () => {
  fork(await caller(useConfig()));
};

start();
// buildCaller();
