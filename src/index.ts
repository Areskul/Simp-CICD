import { log } from "@composables/logger";
import { useDocker } from "@composables/docker";
import { useConfig } from "@composables/config";
import { useCli } from "@composables/cli";
import { green, red, blue } from "picocolors";

const cli = useCli();
const config = useConfig();

console.log(blue("SimpCICD"));
