import { useHooks } from "@resolvers/hooks";
import { useConfig } from "@composables/config";

const { linkHooks } = useHooks();
const start = async () => {
  linkHooks(await useConfig());
};
start();
