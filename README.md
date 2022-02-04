<h1 align="center">Simp CICD</h1>

<h2 align="center">Even the smallest projects need their CICD tools.</h2>

<p align="center">
  <a href="https://simp.areskul.com/" target="_blank" rel="noopener noreferrer">
    <img width="200" src="https://simp.areskul.com/images/simp.png" alt="SimpCICD logo">
  </a>
</p>
<br/>
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
  <a href="https://discord.com/invite/PUkWPNkG">
  <img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true" alt="Chat">
  </a>
</p>

[Checkout the official documentation](https://simp.areskul.com/)

## Warning

Still in active development stage!...

But

- [x] You can now deploy with the CLI!
- [x] Typescript Config files now supported!
- [ ] Git Hooks are stil in progress...

Working on the documentation though.

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
        branch: ["main", "master", "dev"],
        action: ["push"]
      }
    }
  ]
});
export default config;
```

[More in the documentation...](https://simp.areskul.com/)
