module.exports = {
  apps: [
    {
      name: "resellers-bot-api",
      script: "./dist/main.js",
      instances: 0,
      exec_mode: "cluster_mode",
      watch: true,
      merge_logs: true,
      env: {
        SERVER_PORT: 5000,
        DB_URL: "mongodb://localhost/resellers-boticario",
        NODE_ENV: "development",
      },
      env_production: {
        SERVER_PORT: 5001,
        DB_URL: "mongodb://localhost/resellers-boticario",
        NODE_ENV: "production",
      },
    },
  ],
};
