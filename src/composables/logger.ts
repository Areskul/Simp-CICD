import { ILogObject, Logger } from "tslog";
import { appendFileSync, createReadStream } from "fs";
import Fs from "@supercharge/fs";
import readline from "readline";
import { v4 as uuidv4 } from "uuid";
import { once } from "events";
import { blue, green, red, yellow } from "picocolors";
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

const start = async () => {
  const touch = async () => {
    const gitRoot = await getGitPath();
    const path = `${gitRoot}/.simp/logs`;
    // const uuid = uuidv4();
    // const file = `${path}/${uuid}.log`;
    const file = `${path}/raw.log`;
    await Fs.ensureDir(path);
    await Fs.ensureFile(file);
    ctx.path = path;
    ctx.file = file;
  };
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
  await touch();
  await makeLogger();
};

const useLogs = async () => {
  await start();
  const defaultLog = ctx.defaultLog;
  const miniLog = ctx.miniLog;
  const pipelineLog = ctx.pipelineLog as Logger;
  return {
    defaultLog,
    miniLog,
    pipelineLog
  };
};

const printFile = async (file: string) => {
  const indent = {
    sm: " ".repeat(2),
    md: " ".repeat(4),
    lg: " ".repeat(6)
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
      for (const cmd of json.argumentsArray) {
        if (json.logLevel == "silly") {
          console.log(cmd);
        }
        if (json.logLevel == "debug") {
          console.log(indent.md + green(cmd));
        }
        if (json.logLevel == "info") {
          console.log(cmd.replace("step", indent.sm + "step"));
        }
        if (json.logLevel == "error") {
          console.log(indent.md + red(cmd));
        }
        if (json.logLevel == "warn") {
          console.log(indent.md + yellow(cmd));
        }
      }
    });
    await once(rl, "close");
  } catch (err) {
    defaultLog.error(err);
    return;
  }
};

const printLogs = async () => {
  await start();
  const allFiles = await Fs.allFiles(ctx.path as string);
  for (const file of allFiles) {
    await printFile(file);
  }
};

export { defaultLog as log, defaultLog, miniLog, printLogs, useLogs };
