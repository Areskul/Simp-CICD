import { cac } from "cac";
import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { deploy } from "@resolvers/deploy";

export const useCli = () => ({
  cli
});

const cli = cac("simp");

cli
  .command("[root]")
  .option("-p, --print-config", `print loaded config`)
  .action(async (options: any) => {
    if (options?.config) {
      try {
        const config = await useConfig();
        log.info(config);
      } catch (err) {
        log.error(err);
      }
    }
  });

cli
  .command("deploy")
  .option("-c, --config", "<file> to load config from")
  .action((options: any) => {
    deploy();
  });

cli.help();
cli.parse();
