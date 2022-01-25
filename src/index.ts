import { log } from "@composables/logger";
import { useDocker } from "@composables/docker";
import { useConfig } from "@composables/config";
import { useCli } from "@composables/cli";

const cli = useCli();
const config = useConfig();

log.info("Started SimpCICD");
