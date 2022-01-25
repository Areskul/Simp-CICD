import { program } from "commander";
import { useConfig } from "@composables/config";
const config = useConfig();

program
  .command("config")
  .description("Parse th simp CICD config")
  .action(config);
