import { Reseller } from "./reseller.model";
import { ModelRouter } from "../common/model-router";
import * as restify from "restify";

class ResellersRouter extends ModelRouter<Reseller> {
  constructor() {
    super(Reseller);
    this.on("beforeRender", (document) => {
      document.password = undefined;
    });
  }
  applyRoutes(application: restify.Server) {
    application.get("/resellers", this.findAll);

    application.get("/resellers/:id", [this.validateId, this.findById]);

    application.post("/resellers", this.save);

    application.put("/resellers/:id", [this.validateId, this.replace]);

    application.patch("/resellers/:id", [this.validateId, this.update]);

    application.del("/resellers/:id", [this.validateId, this.delete]);
  }
}

export const resellersRouter = new ResellersRouter();
