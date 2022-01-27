import { cac } from "cac";
import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { deploy } from "@resolvers/deploy";
import type { Config } from "@type/index";

const config = useConfig();

export const useCli = (conf: Config) => {
  const cli = cac("simp");

  const setConfigAction = async (options: any) => {
    try {
      config.set(conf);
    } catch (err) {
      log.error(err);
    }
  };
  const getConfigAction = async (options: any) => {
    if (!options.parseConfig) return;
    try {
      const conf = config.get();
      log.info(conf);
    } catch (err) {
      log.error(err);
    }
  };

  cli.option("--parse-config", "parse loaded config");

  cli.command("").action(async (options: any) => {
    await setConfigAction(options);
    await getConfigAction(options);
  });

  cli
    .command("deploy")
    .option("-p, --pipeline", "<srting> pipeline to execute")
    .action(async (options: any) => {
      await setConfigAction(options);
      await getConfigAction(options);
      deploy();
    });

  cli.help();
  cli.parse();
  return cli;
};
