import { cac } from "cac";
import { log } from "@composables/logger";
import { useConfig } from "@composables/config";
import { deploy } from "@resolvers/deploy";
const config = useConfig();
export const useCli = (conf) => {
    const cli = cac("simp");
    const setConfigAction = async (options) => {
        try {
            config.set(conf);
        }
        catch (err) {
            log.error(err);
        }
    };
    const getConfigAction = async (options) => {
        if (!options.parseConfig)
            return;
        try {
            const conf = config.get();
            log.info(conf);
        }
        catch (err) {
            log.error(err);
        }
    };
    cli.option("--parse-config", "parse loaded config");
    cli.command("").action(async (options) => {
        await setConfigAction(options);
        await getConfigAction(options);
    });
    cli
        .command("deploy")
        .option("-p, --pipeline", "<srting> pipeline to execute")
        .action(async (options) => {
        await setConfigAction(options);
        await getConfigAction(options);
        deploy();
    });
    cli.help();
    cli.parse();
    return cli;
};
//# sourceMappingURL=cli.js.map