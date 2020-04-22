import * as restify from "restify";
import { EventEmitter } from "events";
import { NotFoundError } from "restify-errors";
export abstract class Router extends EventEmitter {
  constructor() {
    super();
    this.on("beforeRender", (document) => {
      document.password = undefined;
    });
  }
  abstract applyRoutes(application: restify.Server);

  render(req: restify.Request, resp: restify.Response, next: restify.Next) {
    return (document) => {
      if (document) {
        this.emit("beforeRender", document);
        req.method === "POST" ? resp.status(201) : resp.status(200);
        resp.json(document);
      } else {
        throw new NotFoundError("Document not found");
      }
      return next();
    };
  }

  renderAll(resp: restify.Response, next: restify.Next, options: any = {}) {
    return (documents: any[]) => {
      if (documents) {
        documents.forEach((document) => {
          this.emit("beforeRender", document);
        });
        resp.json(documents);
      } else {
        resp.json([]);
      }
    };
  }
}
