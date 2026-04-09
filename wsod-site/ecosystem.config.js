module.exports = {
  apps: [
    {
      name: "wsod",
      cwd: "./wsod-site",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
