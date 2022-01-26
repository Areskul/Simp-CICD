import typescript from "@rollup/plugin-typescript";
export default {
  input: "src/index.ts",
  output: {
    file: "dist/simp.js",
    format: "cjs",
    sourcemap: true
  },
  plugins: [typescript()]
};
