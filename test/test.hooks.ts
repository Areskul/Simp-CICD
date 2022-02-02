import { useHooks } from "@resolvers/hooks";

const start = async () => {
  const { build, generateOutputs, generateHook } = await useHooks();
  // build();
  generateHook("default");
};
