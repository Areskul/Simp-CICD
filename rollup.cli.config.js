import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
// import nodeResolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";

export const cliConfig = {
  input: "bin/index.ts",
  output: {
    file: "dist/bin/index.js",
    format: "esm",
    sourcemap: true
  },
  external: ["../esm/index.js"],
  plugins: [
    typescript({
      tsconfig: "tsconfig.build.json",
      module: "esnext"
    }),
    typescriptPaths({
      preserveExtensions: true
    })
  ]
};
