import { ILogObject, Logger } from "tslog";
import { appendFileSync, createReadStream } from "fs";
import Fs from "@supercharge/fs";

const logFolder = ".simp/logs";
const logFile = `${logFolder}/rawlogs.json`;

const makeLogger = () => {
  Fs.ensureDir(logFolder);
  Fs.ensureFile(logFile);
  const logToTransport = (logObject: ILogObject) => {
    appendFileSync(logFile, JSON.stringify(logObject) + "\n");
  };
  const log: Logger = new Logger({
    displayFilePath: "displayAll",
    type: "pretty",
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

const log = makeLogger();

const printLogs = () => {
  const stream = createReadStream(logFile);
};

export { log, printLogs };
