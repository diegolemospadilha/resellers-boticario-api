"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../common/environment");
const restify = require("restify");
const mongoose = require("mongoose");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
class Server {
    initializeDb() {
        return mongoose.connect(environment_1.environment.db.url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
    }
    initRoutes(routes) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: "meet-api",
                    version: "1.0.0",
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                // applying routes
                for (let router of routes) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => resolve(this.application));
                this.application.on("restifyError", error_handler_1.handlerError);
            }
            catch (error) { }
        });
    }
    bootstrap(routes = []) {
        return this.initializeDb().then(() => this.initRoutes(routes).then(() => this));
    }
    shutdown() {
        mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
