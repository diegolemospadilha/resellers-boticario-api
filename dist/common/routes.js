"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const restify_errors_1 = require("restify-errors");
class Router extends events_1.EventEmitter {
    constructor() {
        super();
        this.on("beforeRender", (document) => {
            document.password = undefined;
        });
    }
    render(req, resp, next) {
        return (document) => {
            if (document) {
                this.emit("beforeRender", document);
                req.method === "POST" ? resp.status(201) : resp.status(200);
                resp.json(document);
            }
            else {
                throw new restify_errors_1.NotFoundError("Document not found");
            }
            return next();
        };
    }
    renderAll(resp, next) {
        return (documents) => {
            if (documents) {
                documents.forEach((document) => {
                    this.emit("beforeRender", document);
                });
                resp.json(documents);
            }
            else {
                resp.json([]);
            }
        };
    }
}
exports.Router = Router;
