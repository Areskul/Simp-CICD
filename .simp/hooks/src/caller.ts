import { spawn } from "child_process";

//cycle through every hook and launch subprocess for the valid hooks
const subprocess = spawn(process.argv[0], ["child_program.js"], {
  detached: true,
  stdio: "ignore"
});

subprocess.unref();
