import { cac } from "cac";
import { log, printLogs } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import { useHooks } from "@resolvers/hooks";
import { useTrigger } from "@resolvers/trigger";
import type { Config } from "@type/index";
import { blue } from "picocolors";

export const useCli = (config: Config) => {
  const { trigger } = useTrigger(config);
  const { linkHooks } = useHooks();

  const cli = cac("simp");
  const headerMessage = () => {
    console.log(blue("\nSimpCICD\n"));
  };
  const footerMessage = () => {
    console.log(blue("\nDone.\n"));
  };
  const setConfigAction = (options: any) => {
    try {
      useConfig();
    } catch (err) {
      log.error(err);
    }
  };
  const getConfigAction = (options: any) => {
    if (!options.printConfig) return;
    try {
      log.info(config);
    } catch (err) {
      log.error(err);
    }
  };
  const setVerbosityAction = (options: any) => {
    if (!options.verbose) return;
    try {
      //
    } catch (err) {
      log.error(err);
    }
  };

  cli.option("--print-config", "parse loaded config");
  cli.option("-v , --verbose", "print successful commands output");

  cli.command("").action((options: any) => {
    headerMessage();
    setVerbosityAction(options);
    setConfigAction(options);
    getConfigAction(options);
    footerMessage();
  });

  cli
    .command("trigger")
    .option("-p, --pipeline <string>", "[string] pipeline name")
    .action(async (options: any) => {
      headerMessage();
      setVerbosityAction(options);
      setConfigAction(options);
      getConfigAction(options);
      if (!!options.pipeline) {
        await trigger(options.pipeline);
      }
      footerMessage();
    });
  cli
    .command("hooks", "create/refresh git hooks")
    .option("-p, --print", "print enabled hooks")
    .action(async (options: any) => {
      headerMessage();
      setVerbosityAction(options);
      setConfigAction(options);
      getConfigAction(options);
      await linkHooks(config);
      footerMessage();
    });
  cli.command("logs", "print logs").action(async (options: any) => {
    await headerMessage();
    setVerbosityAction(options);
    setConfigAction(options);
    getConfigAction(options);
    await printLogs();
    await footerMessage();
  });

  cli.help();
  cli.parse();
  return cli;
};
