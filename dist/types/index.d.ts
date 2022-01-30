declare const defineConfig = (config: Config): Config => {
  return config;
};

declare const useCli = () => {
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
    headerMessage();
    await setConfigAction(options);
    await getConfigAction(options);
  });

  cli
    .command("trigger")
    .option("-p, --pipeline", "<srting> name of pipeline to execute")
    .action(async (options: any) => {
      headerMessage();
      await setConfigAction(options);
      await getConfigAction(options);
      setVerbosityAction(options);
      await tri.trigger();
    });

  cli.help();
  cli.parse();
  return cli;
};

declare const useHooks = (config?: Config) => {
  // generate hooks from config
};

export { defineConfig, useCli, useHooks };
