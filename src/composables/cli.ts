import { cac } from "cac";
import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { deploy } from "@resolvers/deploy";

export const useCli = () => {
  return cli;
};

const cli = cac("simp");

cli
  .command("")
  .option("-p, --print-config", `print loaded config`)
  .action(async (options: any) => {
    const config = await useConfig();
    try {
      log.info(config);
    } catch (err) {
      log.error(err);
    }
  });

cli
  .command("deploy")
  .option("-c, --config", "<file> to load config from")
  .action((options: any) => {
    deploy();
  });

cli
  .command("deploy")
  .option("-c, --config", "<file> to load config from")
  .action((options: any) => {
    deploy();
  });

cli.help();
cli.parse();
