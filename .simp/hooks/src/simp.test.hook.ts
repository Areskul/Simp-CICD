import { useTrigger, useExec } from "simpcicd";

const { trigger } = useTrigger();
const { exec } = useExec();

exec("touch itsworking");
trigger("default");
