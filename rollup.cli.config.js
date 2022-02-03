import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
// import nodeResolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";

const nodeESM = "#!/usr/bin/node --es-module-specifier-resolution=node";

export const cliConfig = {
  input: "bin/index.ts",
  output: {
    file: "dist/bin/index.mjs",
    format: "esm",
    sourcemap: true,
    banner: nodeESM
  },
  external: ["../esm/index.mjs"],
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
