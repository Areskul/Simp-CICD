import { ILogObject, Logger } from "tslog";
import { appendFileSync, createReadStream } from "fs";
import Fs from "@supercharge/fs";
import readline from "readline";
import { once } from "events";
import { magenta, green, red, yellow } from "picocolors";
import { getGitPath, getBranch } from "@utils/git";

type SuperLog = {
  verbose?: boolean;
  path?: string;
  file?: string;
  defaultLog: Logger;
  miniLog: Logger;
  pipelineLog?: Logger;
  fileLog?: Logger;
};
const miniLog: Logger = new Logger({
  displayFilePath: "hidden",
  dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});
const defaultLog: Logger = new Logger({
  displayFilePath: "displayAll",
  dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});
const ctx: SuperLog = {
  defaultLog: defaultLog,
  miniLog: miniLog,
  pipelineLog: new Logger()
};

const initPath = async () => {
  const gitRoot = await getGitPath();
  const path = `${gitRoot}/.simp/logs`;
  await Fs.ensureDir(path);
  ctx.path = path;
};
const touch = async () => {
  const gitRoot = await getGitPath();
  const path = `${gitRoot}/.simp/logs`;
  const date = new Date().getTime();
  const file = `${path}/${date}.log`;
  await Fs.ensureDir(path);
  await Fs.ensureFile(file);
  ctx.file = file;
};
const initLogger = async () => {
  const makeLogger = async () => {
    const file = ctx.file;
    const log: Logger = new Logger({
      displayFilePath: "displayAll",
      dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      minLevel: "silly"
    });
    const logToTransport = (logObject: ILogObject) => {
      appendFileSync(file as string, JSON.stringify(logObject) + "\n");
    };
    log.attachTransport(
      {
        silly: logToTransport,
        debug: logToTransport,
        trace: logToTransport,
        info: logToTransport,
        warn: logToTransport,
        error: logToTransport,
        fatal: logToTransport
      },
      "silly"
    );
    ctx.pipelineLog = log;
    ctx.fileLog = log.getChildLogger({ suppressStdOutput: true });
  };
  await makeLogger();
};

const initLogs = async () => {
  await initPath();
  await touch();
  await initLogger();
};
const useLogs = () => {
  initPath();
  const defaultLog = ctx.defaultLog;
  const miniLog = ctx.miniLog;
  const pipelineLog = ctx.pipelineLog as Logger;
  const fileLog = ctx.fileLog as Logger;
  const set = (val: boolean) => {
    ctx.verbose = val;
  };
  const get = () => ctx.verbose;
  const verbose = { set: set, get: get };
  return {
    verbose,
    defaultLog,
    miniLog,
    pipelineLog,
    fileLog
  };
};
const printState = async (file: string) => {
  const name = Fs.basename(file, ".log");
  const date = new Date(Number(name)).toLocaleString();
  const stream = createReadStream(file);
  const rl = readline.createInterface({
    input: stream,
    output: process.stdout,
    terminal: false
  });
  try {
    let state = null;
    rl.on("line", (line) => {
      const json = JSON.parse(line);
      if (json.logLevel == "error") {
        state = red("● Fail ");
      } else {
        state = green("● Succeed ");
      }
    });
    await once(rl, "close");
    console.log(state + magenta(date));
  } catch (err) {
    defaultLog.error(err);
    return;
  }
};

interface fileOptions {
  branch?: string;
  pipeline?: string;
}
const printFile = async (file: string, options?: fileOptions) => {
  const indent = {
    xs: " ".repeat(2),
    sm: " ".repeat(4),
    md: " ".repeat(6),
    lg: " ".repeat(8)
  };
  const stream = createReadStream(file);
  const rl = readline.createInterface({
    input: stream,
    output: process.stdout,
    terminal: false
  });
  try {
    rl.on("line", (line) => {
      const json = JSON.parse(line);
      // defaultLog.debug(json);
      for (let cmd of json.argumentsArray) {
        if (json.logLevel == "silly") {
          if (cmd.includes("step")) cmd = indent.sm + cmd;
          if (cmd.includes("pipeline")) cmd = indent.xs + cmd;
          console.log(cmd);
        }
        if (json.logLevel == "debug") {
          cmd = cmd.replace(/  +/g, "\n" + indent.md);
          console.log(indent.md + green(cmd));
        }
        if (json.logLevel == "trace" && ctx.verbose) {
          console.log(cmd);
        }
        if (json.logLevel == "info") {
          if (cmd.includes("branch")) cmd = indent.xs + cmd;
          console.log(magenta(cmd));
        }
        if (json.logLevel == "warn") {
          cmd = cmd.replace(/  +/g, "\n" + indent.md);
          console.log(indent.md + red(cmd));
        }
        if (json.logLevel == "error" && ctx.verbose) {
          console.log(indent.md + red(cmd));
        }
      }
    });
    await once(rl, "close");
    console.log("\n");
  } catch (err) {
    defaultLog.error(err);
    return;
  }
};

const removeLogs = async (forDeletion: string[]) => {
  for (const path of forDeletion) {
    if (await Fs.exists(path)) {
      await Fs.remove(path);
    }
  }
};

const rotateLogs = async () => {
  await initPath();
  const maxItems = 6;
  const allFiles = await Fs.allFiles(ctx.path as string);
  const sorted = allFiles.sort();
  if (sorted.length > maxItems) {
    const forDeletion = sorted.slice(0, sorted.length - maxItems);
    const truncated = sorted.slice(sorted.length - maxItems);
    await removeLogs(forDeletion);
    return truncated;
  } else {
    return sorted;
  }
};
const printLogs = async () => {
  const sorted = await rotateLogs();
  for (const file of sorted) {
    await printState(file);
    await printFile(file);
  }
};

export { defaultLog as log, defaultLog, miniLog, printLogs, initLogs, useLogs };
