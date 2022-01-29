import { cac } from 'cac';
import { Logger } from 'tslog';
import { execSync } from 'child_process';
import { green, red, blue } from 'picocolors';

const log = new Logger();
//const LOG_PREFIX = "theeevent";

let store = {};
const useConfig = () => ({
    defineConfig,
    set: set$1,
    get
});
const set$1 = async (config) => {
    if (!!config) {
        try {
            store.config = config;
            return;
        }
        catch (err) {
            log.error(err);
            return;
        }
    }
    else {
        // cosmiconfig read json or js route file
        log.info("No Config Object explicitly provided");
        log.info("Fallback to simp.config{.js|.json}");
    }
};
const get = () => {
    return store.config;
};
const defineConfig = (config) => {
    return config;
};

const useExec = () => ({
    set,
    execPipeline: execPipeline$1,
    execStep,
    exec
});
let ctx = {};
const set = (newCtx) => {
    ctx = newCtx;
    log.info(ctx);
};
const exec = async (cmd) => {
    try {
        const res = await execSync(cmd, {
            stdio: ["ignore", "pipe", "pipe"]
        });
        console.log(green("\t\t" + cmd));
        if (ctx.verbose)
            log.debug(res.toString());
        return;
    }
    catch (err) {
        log.error(err);
        console.log(red("Some commands couldn't be executed"));
        throw err;
    }
};
const execStep = async (step) => {
    console.log(`\t step: ${step.name}`);
    for (const command of step.commands) {
        try {
            await exec(command);
        }
        catch (err) {
            throw err;
        }
    }
};
const execPipeline$1 = async (pipeline) => {
    console.log(`pipeline: ${pipeline.name}`);
    for (const step of pipeline.steps) {
        try {
            await execStep(step);
        }
        catch (err) {
            throw err;
            // return err;
        }
    }
};

const { execPipeline } = useExec();
const config$1 = useConfig();
const trigger = async () => {
    const conf = config$1.get();
    if (!conf)
        return;
    for (const pipeline of conf.pipelines) {
        try {
            await execPipeline(pipeline);
        }
        catch (err) {
            return err;
        }
    }
};

const config = useConfig();
const execCtx = useExec();
const useCli = (conf) => {
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
        if (!options.printConfig)
            return;
        try {
            const conf = config.get();
            log.info(conf);
        }
        catch (err) {
            log.error(err);
        }
    };
    const setVerbosityAction = async (options) => {
        if (!options.verbose)
            return;
        try {
            execCtx.set({ verbose: true });
        }
        catch (err) {
            log.error(err);
        }
    };
    cli.option("--print-config", "parse loaded config");
    cli.option("-v , --verbose", "print successful commands output");
    cli.command("").action(async (options) => {
        await setConfigAction();
        await getConfigAction(options);
    });
    cli
        .command("trigger")
        .option("-p, --pipeline", "<srting> name of pipeline to execute")
        .action(async (options) => {
        await setConfigAction();
        await getConfigAction(options);
        setVerbosityAction(options);
        trigger();
    });
    cli.help();
    cli.parse();
    return cli;
};

const useSimp = (config) => {
    console.log(blue("\nSimpCICD\n"));
    const cli = useCli(config);
    return cli;
};

export { useSimp };
//# sourceMappingURL=index.js.map
