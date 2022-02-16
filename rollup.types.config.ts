import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import del from "rollup-plugin-delete";
// import nodeResolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";

export const typesConfig = {
  input: "dist/dts/type/index.d.ts",
  output: [{ file: "dist/types/index.d.ts", format: "es" }],
  plugins: [
    typescript({
      tsconfig: "tsconfig.types.json"
    }),
    typescriptPaths({
      preserveExtensions: true
    }),
    dts(),
    del({ targets: "dts", hook: "buildEnd" })
  ]
};
