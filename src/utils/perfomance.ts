import { log } from "@composables/logger";

const getDuration = async (func: any) => {
  const startTime = performance.now();
  const res = await func();
  const endTime = performance.now();
  const duration = endTime - startTime;
  log.info(duration);
  return res;
};

export { getDuration };
