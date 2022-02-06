import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
// import nodeResolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";

const nodeExecPath = "#!/usr/bin/node";
export const cliConfig = {
  input: "bin/cli.ts",
  output: {
    file: "dist/bin/cli.js",
    format: "cjs", // CommonJS
    sourcemap: true,
    banner: nodeExecPath
  },
  external: ["../cjs/index.js"],
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
export const callConfig = {
  input: "bin/caller.ts",
  output: {
    file: "dist/bin/caller.js",
    format: "cjs", // CommonJS
    sourcemap: true,
    banner: nodeExecPath
  },
  external: ["../cjs/index.js"],
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
export const forkConfig = {
  input: "bin/forker.ts",
  output: {
    file: "dist/bin/forker.js",
    format: "cjs", // CommonJS
    sourcemap: true,
    banner: nodeExecPath
  },
  external: ["../cjs/index.js", "./caller.js"],
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
