import { cac } from "cac";

export const useCli = () => ({
  cli
});

const cli = cac("simp");
cli
  .option("-c, --config <file>", `[string] use specified config file`)
  .option("--base <path>", `[string] public base path (default: /)`)
  .option("-l, --logLevel <level>", `[string] info | warn | error | silent`)
  .option("--clearScreen", `[boolean] allow/disable clear screen when logging`)
  .option("-d, --debug [feat]", `[string | boolean] show debug logs`)
  .option("-f, --filter <filter>", `[string] filter debug logs`)
  .option("-m, --mode <mode>", `[string] set env mode`);

cli.help();
cli.parse();
