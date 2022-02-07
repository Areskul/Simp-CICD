import { ILogObject, Logger } from "tslog";
import { appendFileSync } from "fs";

export const log: Logger = new Logger({
  displayFilePath: "displayAll"
});

function logToTransport(logObject: ILogObject) {
  appendFileSync(".simp/logs/rawlogs.txt", JSON.stringify(logObject) + "\n");
}

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
