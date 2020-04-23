"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
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
