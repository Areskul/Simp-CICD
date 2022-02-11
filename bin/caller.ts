import { useConfig, call } from "../cjs/index.js";
const action = process.argv[2];
call({ config: useConfig(), action: action });
