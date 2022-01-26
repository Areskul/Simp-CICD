const nightly = {
  suffix: "front"
  version:"nightly"
  network: "my_bridge",
}
const network = "my_brige"

export default {
  pipelines: [
    {
      name: "production",
      steps: [
        {
          type: "exec",
          name: "build",
          commands: ["docker build --network=${network}"]
        }
      ],
      trigger: {
        branch: ["main", "master", "dev"]
      }
    }
  ]
};
