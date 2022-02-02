import { cac } from "cac";
import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import { useHooks } from "@resolvers/hooks";
import { useTrigger } from "@resolvers/trigger";
import type { Config } from "@type/index";
import { blue } from "picocolors";

export const useCli = () => {
  const { trigger } = useTrigger();
  const { generateHook, printHooks } = useHooks();
  const execCtx = useExec();

  const cli = cac("simp");
  const headerMessage = () => {
    console.log(blue("\nSimpCICD\n"));
  };
  const footerMessage = () => {
    console.log(blue("\n"));
  };
  const setConfigAction = async (options: any) => {
    try {
      useConfig();
    } catch (err) {
      log.error(err);
    }
  };
  const getConfigAction = async (options: any) => {
    if (!options.printConfig) return;
    try {
      const config = useConfig();
      log.info(config);
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
    headerMessage();
    setVerbosityAction(options);
    await setConfigAction(options);
    await getConfigAction(options);
    footerMessage();
  });

  cli
    .command("trigger")
    .option("-p, --pipeline <string>", "[string] pipeline name")
    .action(async (options: any) => {
      headerMessage();
      setVerbosityAction(options);
      await setConfigAction(options);
      await getConfigAction(options);
      if (!!options.pipeline) {
        await trigger(options.pipeline);
      }
      footerMessage();
    });
  cli
    .command("hook")
    .option("-g, --get", "get actual hooks info")
    .option(
      "-p, --pipeline <string>",
      "[string] create/refresh hook for given pipeline name"
    )
    .action(async (options: any) => {
      headerMessage();
      setVerbosityAction(options);
      await setConfigAction(options);
      await getConfigAction(options);
      if (!!options.pipeline) {
        await generateHook(options.pipeline);
      }
      if (options.get) {
        await printHooks();
      }
      footerMessage();
    });

  cli.help();
  cli.parse();
  return cli;
};
