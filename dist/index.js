'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cac = require('cac');
var tslog = require('tslog');
var child_process = require('child_process');
var picocolors = require('picocolors');

const log = new tslog.Logger();

let store = {};
const useConfig = () => ({
    defineConfig,
    set,
    get
});
const set = async (config) => {
    try {
        store.config = config;
        return;
    }
    catch (err) {
        log.error(err);
        return;
    }
};
const get = () => {
    return store.config;
};
const defineConfig = (config) => {
    return config;
};

const useExec = () => ({
    execPipeline: execPipeline$1,
    execStep,
    exec
});
const exec = async (cmd) => {
    try {
        const res = await child_process.execSync(cmd, {
            stdio: ["ignore", "ignore", "pipe"]
        });
        log.debug(picocolors.green(cmd));
        return;
    }
    catch (err) {
        log.error(err);
        console.log(picocolors.red("Some commands couldn't be executed"));
        throw err;
    }
};
const execStep = async (step) => {
    console.log(`step: ${step.name}`);
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
        }
    }
};

const { execPipeline } = useExec();
const config$1 = useConfig();
const deploy = async () => {
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
const useCli = (conf) => {
    const cli = cac.cac("simp");
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
        await setConfigAction();
        await getConfigAction(options);
    });
    cli
        .command("deploy")
        .option("-p, --pipeline", "<srting> pipeline to execute")
        .action(async (options) => {
        await setConfigAction();
        await getConfigAction(options);
        deploy();
    });
    cli.help();
    cli.parse();
    return cli;
};

const useSimp = (config) => {
    console.log(picocolors.blue("SimpCICD"));
    const cli = useCli(config);
    return cli;
};

exports.useSimp = useSimp;
//# sourceMappingURL=index.js.map
