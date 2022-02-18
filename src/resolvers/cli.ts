import { cac } from "cac";
import { log, printLogs, useLogs } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import { useHooks } from "@resolvers/hooks";
import { useTrigger } from "@resolvers/trigger";
import type { Config } from "@def/types";
import { blue } from "picocolors";

export const useCli = (config: Config) => {
  const version = "latest";
  const { trigger } = useTrigger(config);
  const { linkHooks } = useHooks();

  const cli = cac("simp");
  const headerMessage = () => {
    console.log(blue("\nSimpCICD\n"));
  };
  const footerMessage = () => {
    console.log(blue("\nDone.\n"));
  };
  const getConfigAction = async (options: any) => {
    if (!options.printConfig) return;
    try {
      log.info(config);
    } catch (err) {
      log.error(err);
    }
  };
  const setVerbosityAction = async (options: any) => {
    const { verbose } = useLogs();
    if (!options.verbose) return;
    try {
      verbose.set(!!options.verbose);
    } catch (err) {
      log.error(err);
    }
  };

  cli.option("--print-config", "parse loaded config");
  cli.option("-v , --verbose", "print successful commands output");

  cli.command("").action(async (options: any) => {
    headerMessage();
    await getConfigAction(options);
    footerMessage();
  });

  cli
    .command("trigger")
    .option("-p, --pipeline <string>", "[string] pipeline name")
    .option("-v, --verbose", "set verbosity level")
    .option("-b, --background", "run proccess in background")
    .action(async (options: any) => {
      headerMessage();
      await setVerbosityAction(options);
      await getConfigAction(options);
      let opts = {};
      if (options.background) {
        opts = { spawn: true };
      }
      if (!!options.pipeline) {
        await trigger(options.pipeline, opts);
      } else {
        await trigger(options, opts);
      }
      footerMessage();
    });
  cli
    .command("hooks", "create/refresh git hooks")
    .option("-p, --print", "print enabled hooks")
    .option("-d, --delete", "delete simp hooks")
    .action(async (options: any) => {
      headerMessage();
      setVerbosityAction(options);
      await getConfigAction(options);
      await linkHooks(config);
      footerMessage();
    });
  cli
    .command("logs", "print logs")
    .option("-v, --verbose", "set verbosity level")
    .option("-b, --branch", "set the branch")
    .option("--pipeline", "set the pipeline")
    .action(async (options: any) => {
      headerMessage();
      await setVerbosityAction(options);
      await getConfigAction(options);
      await printLogs();
      footerMessage();
    });
  cli.version(version);
  cli.help();
  cli.parse();
  return cli;
};
