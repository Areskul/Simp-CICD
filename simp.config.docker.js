module.exports = {
  pipelines: [
    {
      name: "test",
      steps: [
        {
          type: "docker",
          name: "build",
          image: "node:latest",
          commands: ["yarn install", "yarn build"]
        }
      ],
      trigger: {
        branch: ["main", "master", "dev"]
      }
    }
  ]
};
