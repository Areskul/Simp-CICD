import { caller } from "@resolvers/caller";
import { useConfig } from "@composables/config";
import { fork } from "child_process";

const start = async () => {
  fork(await caller(useConfig()));
};
start();
