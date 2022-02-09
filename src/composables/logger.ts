import { ILogObject, Logger } from "tslog";
import { appendFileSync, createReadStream } from "fs";
import Fs from "@supercharge/fs";
import readline from "readline";
import { v4 as uuidv4 } from "uuid";
import { once } from "events";
import { blue, green, red, yellow } from "picocolors";
import { getGitPath } from "@utils/git";

type LogOptions = {
  verbose?: boolean;
  path?: string;
};

const useLog = () => ({
  defaultLog,
  pipelineLog,
  miniLog
});

const miniLog: Logger = new Logger({
  displayFilePath: "hidden",
  dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});

const defaultLog: Logger = new Logger({
  displayFilePath: "displayAll",
  dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});

const touch = async (): Promise<string> => {
  const gitRoot = await getGitPath();
  const path = `${gitRoot}/.simp/logs`;
  const uuid = uuidv4();
  const file = `${path}/${uuid}.log`;
  Fs.ensureDir(path);
  Fs.ensureFile(file);
  return file;
};

const makeLogger = async () => {
  const gitRoot = await getGitPath();
  const path = `${gitRoot}/.simp/logs`;
  const defaultOptions = {
    verbose: true
  };
  const logFile = await touch();

  const logToTransport = (logObject: ILogObject) => {
    appendFileSync(logFile, JSON.stringify(logObject) + "\n");
  };

  const log: Logger = new Logger({
    displayFilePath: "displayAll",
    dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

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
  return log;
};

let pipelineLog: Logger;
makeLogger().then((res) => (pipelineLog = res));

const printFile = async (file: string) => {
  const stream = createReadStream(file);
  const rl = readline.createInterface({
    input: stream,
    output: process.stdout,
    terminal: false
  });
  try {
    rl.on("line", (line) => {
      const json = JSON.parse(line);
      for (const cmd of json.argumentsArray) {
        if (json.logLevel == "silly") {
          console.log(cmd);
        }
        if (json.logLevel == "info") {
          console.log(green(cmd));
        }
        if (json.logLevel == "error") {
          console.log(red(cmd));
        }
        if (json.logLevel == "warn") {
          console.log(yellow(cmd));
        }
      }
    });
    await once(rl, "close");
  } catch (err) {
    miniLog.error(err);
    return;
  }
};
const printLogs = async () => {
  const gitRoot = await getGitPath();
  const path = `${gitRoot}/.simp/logs`;
  const allFiles = await Fs.allFiles(path);
  for (const file of allFiles) {
    await printFile(file);
  }
};

export { defaultLog as log, printLogs, useLog };
