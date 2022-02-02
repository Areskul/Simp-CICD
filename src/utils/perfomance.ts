import { log } from "@composables/logger";

const getDuration = (func: any) => {
  const startTime = performance.now();
  func();
  const endTime = performance.now();
  const duration = endTime - startTime;
  log.info(duration);
};

export { getDuration };
