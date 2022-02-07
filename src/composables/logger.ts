import { ILogObject, Logger } from "tslog";
import { appendFileSync, createReadStream } from "fs";

const logfile = ".simp/logs/rawlogs.json";

const makeLogger = () => {
  const logToTransport = (logObject: ILogObject) => {
    appendFileSync(logfile, JSON.stringify(logObject) + "\n");
  };
  const log: Logger = new Logger({
    displayFilePath: "displayAll",
    type: "pretty"
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
  const stream = createReadStream(logfile);
};

export { log, printLogs };
