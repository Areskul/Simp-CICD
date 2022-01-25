import { log } from "@composables/logger";
import { useDocker } from "@composables/docker";
import { useConfig } from "@composables/config";

log.info("Started SimpCICD");

const { dockerize } = useDocker();
const config = useConfig();

dockerize({
  name: "test",
  image: "node:latest"
});

log.info("Stopped SimpCICD");
