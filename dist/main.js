"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reseller_router_1 = require("./resellers/reseller.router");
const server_1 = require("./server/server");
const server = new server_1.Server();
server
    .bootstrap([reseller_router_1.resellersRouter])
    .then((server) => {
    console.log("Server is running on port ", server.application.address());
})
    .catch((error) => {
    console.log("Server failed to start");
    console.error(error);
    process.exit(1);
});
