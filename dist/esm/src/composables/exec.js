import { log } from "@composables/logger";
import { execSync as $ } from "child_process";
import { green, red } from "picocolors";
export const useExec = () => ({
    execPipeline,
    execStep,
    exec
});
const exec = async (cmd) => {
    try {
        const res = await $(cmd, {
            stdio: ["ignore", "ignore", "pipe"]
        });
        log.debug(green(cmd));
        return;
    }
    catch (err) {
        log.error(err);
        console.log(red("Some commands couldn't be executed"));
        throw err;
    }
};
const execStep = async (step) => {
    console.log(`step: ${step.name}`);
    out: for (const command of step.commands) {
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
    out: for (const step of pipeline.steps) {
        try {
            await execStep(step);
        }
        catch (err) {
            throw err;
            // return err;
        }
    }
};
//# sourceMappingURL=exec.js.map