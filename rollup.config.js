import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
// import nodeResolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/cjs/index.js",
        format: "cjs", // commonJS
        sourcemap: true
      },
      {
        file: "dist/esm/index.js",
        format: "esm", // ES Modules
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        module: "esnext",
        declaration: true
      }),
      typescriptPaths({
        preserveExtensions: true
      })
    ]
  },
  {
    input: "dist/dts/index.d.ts",
    output: [{ file: "dist/types/index.d.ts", format: "es" }],
    plugins: [
      // typescript({
      //   module: "esnext",
      //   declaration: true
      // }),
      typescriptPaths({
        preserveExtensions: true
      }),
      dts()
    ]
  }
];
