import { useCli } from "@composables/cli";
import { blue } from "picocolors";
const useSimp = (config) => {
    console.log(blue("SimpCICD"));
    const cli = useCli(config);
    return cli;
};
export { useSimp };
//# sourceMappingURL=index.js.map