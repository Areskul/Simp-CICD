import { log } from "@composables/logger";
import { useDocker } from "@composables/docker";
import { useConfig } from "@composables/config";
import { useCli } from "@composables/cli";
import { green, red, blue } from "picocolors";
import type { Config } from "@type/index";

const useSimp = (config: Config) => {
  console.log(blue("\nSimpCICD\n"));
  const cli = useCli(config);
  return cli;
};

export { useSimp };
