"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reseller_model_1 = require("./reseller.model");
const model_router_1 = require("../common/model-router");
class ResellersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reseller_model_1.Reseller);
        this.on("beforeRender", (document) => {
            document.password = undefined;
        });
    }
    applyRoutes(application) {
        application.get("/resellers", this.findAll);
        application.get("/resellers/:id", [this.validateId, this.findById]);
        application.post("/resellers", this.save);
        application.put("/resellers/:id", [this.validateId, this.replace]);
        application.patch("/resellers/:id", [this.validateId, this.update]);
        application.del("/resellers/:id", [this.validateId, this.delete]);
    }
}
exports.resellersRouter = new ResellersRouter();
