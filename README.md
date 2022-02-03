# Simp CICD

Even the smallest projects need their CICD tools.

<p align="center">
  <a href="https://simp.areskul.com/" target="_blank" rel="noopener noreferrer">
    <img width="200" src="https://simp.areskul.com/images/simp.png" alt="SimpCICD logo">
  </a>
</p>
<br/>

Deployment made easy.

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
