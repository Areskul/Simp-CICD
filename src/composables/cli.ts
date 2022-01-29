import { cac } from "cac";
import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import { trigger } from "@resolvers/trigger";
import type { Config } from "@type/index";

const config = useConfig();
const execCtx = useExec();

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
    if (!options.printConfig) return;
    try {
      const conf = config.get();
      log.info(conf);
    } catch (err) {
      log.error(err);
    }
  };
  const setVerbosityAction = async (options: any) => {
    if (!options.verbose) return;
    try {
      execCtx.set({ verbose: true });
    } catch (err) {
      log.error(err);
    }
  };

  cli.option("--print-config", "parse loaded config");
  cli.option("-v , --verbose", "print successful commands output");

  cli.command("").action(async (options: any) => {
    await setConfigAction(options);
    await getConfigAction(options);
  });

  cli
    .command("trigger")
    .option("-p, --pipeline", "<srting> name of pipeline to execute")
    .action(async (options: any) => {
      await setConfigAction(options);
      await getConfigAction(options);
      setVerbosityAction(options);
      trigger();
    });

  cli.help();
  cli.parse();
  return cli;
};
