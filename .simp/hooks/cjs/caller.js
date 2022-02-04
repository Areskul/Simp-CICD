#!/usr/bin/node
'use strict';

var tslog = require('tslog');
var child_process = require('child_process');
var picocolors = require('picocolors');
var lilconfig = require('lilconfig');
var lilconfigTsLoader = require('@sliphua/lilconfig-ts-loader');

const log = new tslog.Logger({
    displayFilePath: "displayAll"
});

let store = {
    verbose: false
};
const useExec = (ctx) => {
    const setContext = (ctx) => {
        store = ctx;
        log.debug(store);
    };
    const exec = async (cmd, opts) => {
        try {
            const res = await child_process.execSync(cmd, {
                stdio: ["ignore", "pipe", "pipe"]
            });
            log.debug(picocolors.green(cmd));
            if (store.verbose)
                log.debug("\n" + res);
            return res;
        }
        catch (err) {
            if (opts && opts["non-blocking"]) {
                log.warn(picocolors.yellow(cmd));
                if (store.verbose)
                    log.warn("\n" + err);
                return err;
            }
            else {
                log.error(picocolors.red(cmd));
                if (store.verbose)
                    log.error("\n" + err);
                throw err;
            }
        }
    };
    const execStep = async (step) => {
        const opts = {
            "non-blocking": !!step["non-blocking"]
        };
        log.info(`step: ${step.name}`);
        if (step["non-blocking"]) {
            if (store.verbose)
                log.debug(opts);
        }
        for (const cmd of step.commands) {
            try {
                await exec(cmd, opts);
                // return;
            }
            catch (err) {
                if (opts["non-blocking"]) ;
                else {
                    throw null;
                }
            }
        }
    };
    const execPipeline = async (pipeline) => {
        log.info(`pipeline: ${pipeline.name}`);
        for (const step of pipeline.steps) {
            await execStep(step);
        }
    };
    return {
        setContext,
        execPipeline,
        execStep,
        exec
    };
};

const useTrigger = (config) => {
    const { execPipeline } = useExec();
    const trigger = async (name) => {
        if (!config)
            return;
        const pipelines = config.pipelines.filter((pipeline) => pipeline.name == name);
        if (!isUnique(pipelines))
            return;
        for (const pipeline of pipelines) {
            try {
                await execPipeline(pipeline);
            }
            catch (err) {
                return err;
            }
        }
    };
    const isUnique = (pipelines) => {
        if (pipelines.length == 0) {
            log.warn(`pipeline "${name}" is undefined`);
            return false;
        }
        if (pipelines.length > 1) {
            log.warn(`pipeline "${name}" has duplicates`);
            return false;
        }
        else {
            return true;
        }
    };
    return {
        trigger,
        isUnique
    };
};

const useConfig = (config) => {
    const store = { config: {} };
    const set = (config) => {
        if (!!config) {
            store.config = config;
            return store.config;
        }
        try {
            let config;
            const options = {
                searchPlaces: ["simp.config.ts", "simp.config.js"],
                loaders: {
                    ".ts": lilconfigTsLoader.TypeScriptLoader,
                    ".js": lilconfigTsLoader.TypeScriptLoader
                }
            };
            const res = lilconfig.lilconfigSync("simp", options).search();
            if (res) {
                config = res.config;
                store.config = config;
            }
            return store.config;
        }
        catch (err) {
            log.error(err);
            return;
        }
    };
    set(config);
    return store.config;
};

const { exec } = useExec();
const getBranch = () => {
    const name = exec("git rev-parse --abbrev-ref HEAD");
    return name;
};

const caller = (config) => {
    const pipelines = config.pipelines.filter((pipeline) => pipeline.trigger.branch.includes(getBranch()));
    const { trigger } = useTrigger(useConfig());
    for (const pipeline of pipelines) {
        trigger(pipeline.name);
    }
};
caller();
