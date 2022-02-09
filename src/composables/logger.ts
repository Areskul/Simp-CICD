import { ILogObject, Logger } from "tslog";
import { appendFileSync, createReadStream } from "fs";
import Fs from "@supercharge/fs";
import readline from "readline";
import { once } from "events";
import { magenta, green, red, yellow } from "picocolors";
import { getGitPath } from "@utils/git";

type SuperLog = {
  verbose?: boolean;
  path?: string;
  file?: string;
  defaultLog: Logger;
  miniLog: Logger;
  pipelineLog?: Logger;
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
      "debug"
    );
    ctx.pipelineLog = log;
  };
  await makeLogger();
};

const initLogs = async () => {
  await initPath();
  await touch();
  await initLogger();
};
const useLogs = () => {
  const defaultLog = ctx.defaultLog;
  const miniLog = ctx.miniLog;
  const pipelineLog = ctx.pipelineLog as Logger;
  return {
    defaultLog,
    miniLog,
    pipelineLog
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
        state = red("● Failed ");
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

const printFile = async (file: string) => {
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
          console.log(cmd);
        }
        if (json.logLevel == "debug") {
          console.log(indent.md + green(cmd));
        }
        if (json.logLevel == "info") {
          cmd = cmd.replace("step", indent.sm + "step");
          cmd = cmd.replace("pipeline", indent.xs + "pipeline");
          console.log(cmd);
        }
        if (json.logLevel == "warn") {
          console.log(indent.md + yellow(cmd));
        }
        if (json.logLevel == "error") {
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

const printLogs = async () => {
  await initPath();
  const allFiles = await Fs.allFiles(ctx.path as string);
  for (const file of allFiles) {
    await printState(file);
    await printFile(file);
  }
};

export { defaultLog as log, defaultLog, miniLog, printLogs, initLogs, useLogs };
