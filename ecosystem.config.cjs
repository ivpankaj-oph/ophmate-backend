module.exports = {
  apps: [
    {
      name: "server",
      script: "./server.js",
      watch: true,
      env: {
        NODE_ENV: "development"
      }
    },
    {
      name: "email-worker",
      script: "./services/kafka/worker/emailWorker.js",
      watch: true,
      env: {
        NODE_ENV: "development"
      }
    },
      {
      name: "events-worker",
      script: "./services/bullmq/workers/index.js",
      watch: true,
      env: {
        NODE_ENV: "development"
      }
    },
  ]
};
