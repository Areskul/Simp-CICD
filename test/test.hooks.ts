import { useHooks } from "@resolvers/hooks";
import { useConfig } from "@composables/config";

const start = async () => {
  const { build, generateOutputs, generateHook } = useHooks(useConfig());
  // build();
  generateHook("default");
};

start();
