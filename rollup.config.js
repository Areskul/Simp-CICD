import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
export default {
  input: "dist/cjs/index.js",
  // output: {
  //   file: "dist/cjs/simp.js",
  //   format: "cjs",
  //   sourcemap: true
  // },
  plugins: [
    typescript(),
    typescriptPaths({
      preserveExtensions: true
    })
  ]
};
