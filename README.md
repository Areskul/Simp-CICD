<p align="center">
  <a href="https://simp.areskul.com/image/simp_dark.png" target="_blank" rel="noopener noreferrer">
    <img width="500" src="https://simp.areskul.com/images/simp.png" alt="SimpCICD logo">
  </a>
</p>
<br/>

# Simp CICD

# WARNING: EARLY DEVELOPMENT STAGE!!!

# NOT PRODUCTION READY!!! DON'T USE NOW

## What it is

It's a tool to deploy your site online

## What it does

It takes "bash" commands and triggers it when you demand it.

I was tired of the heavy config needed for DroneCI, CIRCLECI and others to work well.
As my projects or so small

PS: optimized for Node.js for now.

## Yes but how ?

It uses cosmicconfig so feel free to use your favorite file format.
And if you are use to DRONE CI, things wan't change a lot.

```js
module.exports = {
  pipeline: {
    name: "test",
    steps: [
      {
        name: "build",
        image: "node:latest",
        commands: ["yarn install", "yarn build"]
      }
    ],
    trigger: {
      branch: ["main", "master", "dev"]
    }
  }
};
```
