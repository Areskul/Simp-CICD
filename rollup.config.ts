import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { cliConfig, callConfig, forkConfig } from "./rollup.cli.config.js";
import { typesConfig } from "./rollup.types.config.js";
// import nodeResolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";

const nodeExecPath = "#!/usr/bin/node --experimental-modules";
export default [
  typesConfig,
  {
    input: "src/index.ts",
    output: {
      file: "dist/esm/index.js",
      format: "esm",
      sourcemap: true,
      banner: nodeExecPath
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json"
      }),
      typescriptPaths({
        preserveExtensions: true
      })
    ]
  },
  cliConfig,
  callConfig,
  ...forkConfig()
];
