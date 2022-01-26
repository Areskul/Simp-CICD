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
  .option("-c, --config", `print config`)
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

cli.command("deploy").action(async (options: any) => {
  await deploy();
});

cli.help();
cli.parse();
