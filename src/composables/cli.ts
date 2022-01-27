import { cac } from "cac";
import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { deploy } from "@resolvers/deploy";

const config = useConfig();

export const useCli = () => {
  return cli;
};

const cli = cac("simp");

const setConfigAction = async (options: any) => {
  try {
    config.set(options.config);
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

cli
  .option("-c, --config", "<file> to load config from")
  .option("--parse-config", "parse loaded config");

cli.command("").action((options: any) => {
  setConfigAction(options);
  getConfigAction(options);
});

cli
  .command("deploy")
  .option("-p, --pipeline", "<srting> pipeline to execute")
  .action((options: any) => {
    setConfigAction(options);
    getConfigAction(options);
    deploy();
  });

cli.help();
// cli.version(require("@/../package.json").version);
cli.parse();
