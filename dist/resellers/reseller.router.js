"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./../common/environment");
const authz_handler_1 = require("./../security/authz.handler");
const calculateCashback_1 = require("./../common/calculateCashback");
const purchase_model_1 = require("./../purchases/purchase.model");
const restify_errors_1 = require("restify-errors");
const reseller_model_1 = require("./reseller.model");
const model_router_1 = require("../common/model-router");
const auth_handler_1 = require("../security/auth.handler");
const request = require("request");
class ResellersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reseller_model_1.Reseller);
        this.getCashback = (req, res, next) => {
            if (req.query.cpf) {
                let cpf = req.query.cpf
                    .replace(".", "")
                    .replace(".", "")
                    .replace("-", "");
                if (cpf.length === 11) {
                    console.log("cpf: ", cpf);
                    var options = {
                        method: "GET",
                        url: `${environment_1.environment.bot.url}/cashback?cpf=${cpf}`,
                        headers: {
                            authorization: environment_1.environment.bot.token,
                            "content-type": "application/json",
                            accept: "application/json",
                        },
                        json: true,
                    };
                    request(options, (err, resp, body) => {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("body: ", body);
                        res.send(body);
                        next();
                    });
                }
                else {
                    return next(new restify_errors_1.BadRequestError("Invalid CPF"));
                }
            }
            else {
                return next(new restify_errors_1.BadRequestError("CPF is required"));
            }
        };
        this.findPurchases = (req, res, next) => {
            reseller_model_1.Reseller.findById(req.params.id, "+purchases")
                .then((reseller) => {
                if (!reseller) {
                    return new restify_errors_1.NotFoundError("Reseller not found");
                }
                else {
                    res.json(reseller.purchases);
                    next();
                }
            })
                .catch(next);
        };
        this.addPurchase = (req, res, next) => {
            reseller_model_1.Reseller.findById(req.params.id, "+purchases")
                .then((reseller) => {
                if (!reseller) {
                    new restify_errors_1.NotFoundError("Reseller not found");
                }
                else {
                    let purchase = new purchase_model_1.PurchaseModel(req.body);
                    purchase.percentageCashback = calculateCashback_1.calculateCashback(purchase.price);
                    purchase.valueCashback = calculateCashback_1.calculateValueCashback(purchase);
                    if (reseller.cpf === "153.509.460-56") {
                        purchase.status = "Aprovado";
                    }
                    reseller.purchases.push(purchase);
                    return reseller.save();
                }
            })
                .then((reseller) => {
                res.status(201);
                res.json(reseller.purchases.pop());
            })
                .catch(next);
        };
        this.on("beforeRender", (document) => {
            document.password = undefined;
            document.purchases = undefined;
            document.profiles = undefined;
        });
    }
    applyRoutes(application) {
        application.get("/resellers", this.findAll);
        application.get("/resellers/:id", [
            this.validateId,
            authz_handler_1.authorize("reseller"),
            authz_handler_1.validateUserOperations(),
            this.findById,
        ]);
        application.post("/resellers", this.save);
        application.put("/resellers/:id", [
            this.validateId,
            authz_handler_1.authorize("reseller"),
            authz_handler_1.validateUserOperations(),
            this.replace,
        ]);
        application.patch("/resellers/:id", [
            this.validateId,
            authz_handler_1.authorize("reseller"),
            authz_handler_1.validateUserOperations(),
            this.update,
        ]);
        application.del("/resellers/:id", [
            this.validateId,
            authz_handler_1.authorize("reseller"),
            authz_handler_1.validateUserOperations(),
            this.delete,
        ]);
        application.get("/resellers/:id/purchases", [
            this.validateId,
            authz_handler_1.authorize("reseller"),
            authz_handler_1.validateUserOperations(),
            this.findPurchases,
        ]);
        application.post("/resellers/:id/purchases", [
            this.validateId,
            authz_handler_1.authorize("reseller"),
            authz_handler_1.validateUserOperations(),
            this.addPurchase,
        ]);
        application.post("/resellers/auth", [auth_handler_1.authenticate]);
        application.get("/resellers/cashback", this.getCashback);
    }
}
exports.resellersRouter = new ResellersRouter();
