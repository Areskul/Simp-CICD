'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cac = require('cac');
var tslog = require('tslog');
var lilconfig = require('lilconfig');
var tsloader = require('cosmiconfig-typescript-loader');
var child_process = require('child_process');
var picocolors = require('picocolors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var tsloader__default = /*#__PURE__*/_interopDefaultLegacy(tsloader);

const log = new tslog.Logger();

const store = {};
const useConfig = () => ({
    defineConfig,
    set: set$1,
    get
});
const set$1 = async () => {
    try {
        let config = null;
        const options = {
            searchPlaces: ["simp.config.js", "simp.config.ts"],
            loaders: {
                ".ts": tsloader__default["default"]()
            }
        };
        const res = await lilconfig.lilconfig("simp", options).search();
        if (res) {
            config = res.config;
            store.config = config;
        }
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
    set,
    execPipeline,
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
        const res = await child_process.execSync(cmd, {
            stdio: ["ignore", "pipe", "pipe"]
        });
        console.log(picocolors.green("\t\t" + cmd));
        if (ctx.verbose)
            log.debug(res.toString());
        return;
    }
    catch (err) {
        log.error(err);
        console.log(picocolors.red("Some commands couldn't be executed"));
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
const execPipeline = async (pipeline) => {
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

const ex = useExec();
const config$1 = useConfig();
const useTrigger = () => {
    return {
        trigger
    };
};
const trigger = async () => {
    const conf = config$1.get();
    if (!conf)
        return;
    for (const pipeline of conf.pipelines) {
        try {
            await ex.execPipeline(pipeline);
        }
        catch (err) {
            return err;
        }
    }
};

const config = useConfig();
const execCtx = useExec();
const tri = useTrigger();
const useCli = () => {
    const cli = cac.cac("simp");
    const headerMessage = () => {
        console.log(picocolors.blue("\nSimpCICD\n"));
    };
    const setConfigAction = async (options) => {
        try {
            config.set();
        }
        catch (err) {
            log.error(err);
        }
    };
    const getConfigAction = async (options) => {
        if (!options.printConfig)
            return;
        try {
            await config.set();
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
        headerMessage();
        await setConfigAction();
        await getConfigAction(options);
    });
    cli
        .command("trigger")
        .option("-p, --pipeline", "<srting> name of pipeline to execute")
        .action(async (options) => {
        headerMessage();
        await setConfigAction();
        await getConfigAction(options);
        setVerbosityAction(options);
        await tri.trigger();
    });
    cli.help();
    cli.parse();
    return cli;
};

const useHooks = (config) => {
    // generate hooks from config
};

exports.defineConfig = defineConfig;
exports.useCli = useCli;
exports.useHooks = useHooks;
//# sourceMappingURL=index.js.map
