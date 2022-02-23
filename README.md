# Simp CICD

Even the smallest projects need their CICD tools.

<p align="center">
  <a href="https://simp.areskul.com/" target="_blank" rel="noopener noreferrer">
    <img width="200" src="https://simp.areskul.com/images/simp.png" alt="SimpCICD logo">
  </a>
</p>
<p align="center">Deployment made easy.</p>
<p align="center">
  <a href="https://npmcharts.com/compare/simpcicd?minimal=true">
  <img src="https://img.shields.io/npm/dm/simpcicd.svg?sanitize=true" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/simpcicd">
  <img src="https://img.shields.io/npm/v/simpcicd.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/simpcicd">
  <img src="https://img.shields.io/npm/l/simpcicd.svg?sanitize=true" alt="License">
  </a>
  <a href="https://discord.gg/swNRD3Xysz">
  <img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true" alt="Chat">
  </a>
</p>
<p align="center">
  <a href="https://simp.areskul.com">
    Checkout the official documentation
  </a>
</p>
<br/>

## Warning

Still in active early development stage!...

Send me a message on the [discord](https://discord.gg/swNRD3Xysz)
for every problem you could encounter!

Don't bother beeing polite! We're talking crucial software improvement!
I'll do my best to patch the package in the day!

## Getting Started

### Install

Install the CLI

```bash
yarn add -g simpcicd
```

```bash
npm install -g simpcicd
```

And helpers you need

```bash
yarn add -D simpcicd
```

```bash
npm install --save-dev simpcicd
```

Edit your config file(s) in your project roots

```ts
// simp.config.ts
// very tiny config file example

import { defineConfig } from "simpcicd";

const localFiles = `.vitepress/dist/*`;
const remoteFoler = `Static/docs.simp.cicd`;

const config = defineConfig({
  pipelines: [
    {
      name: "default",
      steps: [
        {
          name: "build",
          commands: ["yarn", "yarn build"]
        },
        {
          name: "deploy",
          commands: [`rsync -ar ${localFiles} linode:${remoteFoler}`]
        }
      ],
      trigger: {
        branches: ["main", "master", "dev"],
        actions: ["pre-push"]
      }
    }
  ]
});
export default config;
```

Activate hooks with

```bash
simp hooks
```

Print Logs with

```bash
simp logs
```

The non-verbose "minimal" output looks actually like that.
And is likely to change for the better.

<p align="center">
  <img style="width: 100%" src="https://simp.areskul.com/images/logs.png" alt="pretty logs">
</p>

[More in the documentation...](https://simp.areskul.com/)
