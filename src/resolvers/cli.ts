import { cac } from "cac";
import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
import { useTrigger } from "@resolvers/trigger";
import type { Config } from "@type/index";
import { blue } from "picocolors";

const config = useConfig();
const execCtx = useExec();
const tri = useTrigger();

export const useCli = () => {
  const cli = cac("simp");
  const headerMessage = () => {
    console.log(blue("\nSimpCICD\n"));
  };
  const setConfigAction = async (options: any) => {
    try {
      config.set();
    } catch (err) {
      log.error(err);
    }
  };
  const getConfigAction = async (options: any) => {
    if (!options.printConfig) return;
    try {
      await config.set();
      const conf = await config.get();
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
    headerMessage();
    setVerbosityAction(options);
    await setConfigAction(options);
    await getConfigAction(options);
  });

  cli
    .command("trigger")
    .option("-p, --pipeline <string>", "[srting] pipeline name")
    .action(async (options: any) => {
      headerMessage();
      setVerbosityAction(options);
      await setConfigAction(options);
      await getConfigAction(options);
      if (!!options.pipeline) {
        await tri.trigger(options.pipeline);
      }
    });

  cli.help();
  cli.parse();
  return cli;
};
