import { useCli } from "@resolvers/cli";
import { useConfig } from "@composables/config";
useCli(useConfig());
