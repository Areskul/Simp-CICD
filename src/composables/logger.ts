import { ILogObject, Logger } from "tslog";
import { appendFileSync, createReadStream } from "fs";
import Fs from "@supercharge/fs";
import readline from "readline";
import { v4 as uuidv4 } from "uuid";
import { once } from "events";
import { blue, green, red, yellow } from "picocolors";

type LogOptions = {
  verbose?: boolean;
  path?: string;
};
const path = ".simp/logs";

const touch = (): string => {
  const uuid = uuidv4();
  const file = `${path}/${uuid}.log`;
  Fs.ensureDir(path);
  Fs.ensureFile(file);
  return file;
};

const makeLogger = () => {
  const defaultOptions = {
    verbose: true
  };
  const logFile = touch();

  const logToTransport = (logObject: ILogObject) => {
    appendFileSync(logFile, JSON.stringify(logObject) + "\n");
  };

  const log: Logger = new Logger({
    displayFilePath: "displayAll",
    dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    minLevel: "info"
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

const log = makeLogger();
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
        if (json.logLevel == "info") {
          console.log(green(cmd));
        }
        if (json.logLevel == "error") {
          console.log(red(cmd));
        }
      }
    });
    await once(rl, "close");
  } catch (err) {
    log.error(err);
    return;
  }
};
const printLogs = async () => {
  const allFiles = await Fs.allFiles(path);
  for (const file of allFiles) {
    await printFile(file);
  }
};

export { log, printLogs };
