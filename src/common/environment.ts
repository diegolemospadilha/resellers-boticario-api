export const environment = {
  server: { port: process.env.PORT || 3000 },
  db: { url: process.env.DB_URL || "mongodb://localhost/resellers-boticario" },
  security: {
    saltRounds: process.env.SALT_ROUNDS || 10,
    apiSecret: process.env.API_SECRET || "resellers-bot-api",
  },
  log: {
    name: process.env.LOG_LEVEL || "reseller-boticario-api",
    level: "debug",
  },
};
