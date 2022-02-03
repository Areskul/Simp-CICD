import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { cliConfig } from "./rollup.cli.config.js";
import { typesConfig } from "./rollup.types.config.js";
// import nodeResolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/esm/index.mjs",
      format: "esm", // ES Modules
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.build.json",
        module: "esnext"
      }),
      typescriptPaths({
        preserveExtensions: true
      })
    ]
  },
  typesConfig,
  cliConfig
];
