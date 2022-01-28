import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
export default {
  input: "dist/types/index.ts",
  output: {
    file: "dist/types/index.ts",
    format: "cjs",
    sourcemap: true
  },
  plugins: [
    typescript(),
    typescriptPaths({
      preserveExtensions: true
    })
  ]
};
