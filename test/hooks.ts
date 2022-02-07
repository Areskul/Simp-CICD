import { useHooks } from "@resolvers/hooks";
import { useConfig } from "@composables/config";

const { linkHooks } = useHooks();

linkHooks(useConfig());
