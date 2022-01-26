module.exports = {
  pipelines: [
    {
      name: "production",
      //define top level variables
      commands: ["VERSION=nightly", "SUFFIX=api", "NETWORK=my_bridge"],
      steps: [
        {
          type: "exec",
          name: "build",
          commands: ["docker build --network $NETWORK"]
        }
      ],
      trigger: {
        branch: ["main", "master", "dev"]
      }
    }
  ]
};
