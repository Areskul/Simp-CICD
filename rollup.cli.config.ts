import typescript from "@rollup/plugin-typescript";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
// import nodeResolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
const GitHooks = [
  "pre-commit",
  "pre-push",
  "pre-receive",
  "update",
  "post-receive"
];

const nodeExecPath = "#!/usr/bin/node";
export const cliConfig = {
  input: "bin/cli.ts",
  output: {
    file: "dist/bin/cli.js",
    format: "cjs", // CommonJS
    sourcemap: false,
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
    sourcemap: false,
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

export const forkConfig = () => {
  const config = [];
  for (const action of GitHooks) {
    config.push({
      input: `bin/forker/${action}.ts`,
      output: {
        file: `dist/bin/forker/${action}.js`,
        format: "cjs", // CommonJS
        sourcemap: false,
        banner: nodeExecPath
      },
      external: ["../../cjs/index.js"],
      plugins: [
        typescript({
          tsconfig: "tsconfig.build.json",
          module: "esnext"
        }),
        typescriptPaths({
          preserveExtensions: true
        })
      ]
    });
  }
  return config;
};
