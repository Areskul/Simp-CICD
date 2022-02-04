import { useTrigger, useExec } from "simpcicd";

const { trigger } = useTrigger();
const { exec } = useExec();

const start = async () => {
  await trigger("default");
  await process.exit();
};

start();
