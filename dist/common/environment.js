"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    server: { port: process.env.PORT || 3000 },
    bot: {
        url: process.env.API_URL ||
            "https://mdaqk8ek5j.execute-api.us-east-1.amazonaws.com/v1",
        token: "ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm",
    },
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
