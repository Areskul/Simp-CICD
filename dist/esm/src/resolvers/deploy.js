import { useConfig } from "@composables/config";
import { useExec } from "@composables/exec";
const { execPipeline } = useExec();
const config = useConfig();
export const deploy = async () => {
    const conf = config.get();
    if (!conf)
        return;
    for (const pipeline of conf.pipelines) {
        try {
            await execPipeline(pipeline);
        }
        catch (err) {
            return err;
        }
    }
};
//# sourceMappingURL=deploy.js.map