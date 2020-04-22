import { authorize, validateUserOperations } from "./../security/authz.handler";
import {
  calculateCashback,
  calculateValueCashback,
} from "./../common/calculateCashback";
import { Purchase, PurchaseModel } from "./../purchases/purchase.model";
import { NotFoundError } from "restify-errors";
import { Reseller } from "./reseller.model";
import { ModelRouter } from "../common/model-router";
import * as restify from "restify";
import { authenticate } from "../security/auth.handler";
class ResellersRouter extends ModelRouter<Reseller> {
  constructor() {
    super(Reseller);
    this.on("beforeRender", (document) => {
      document.password = undefined;
      document.purchases = undefined;
    });
  }

  findPurchases = (req, res, next) => {
    Reseller.findById(req.params.id, "+purchases")
      .then((reseller) => {
        if (!reseller) {
          new NotFoundError("Reseller not found");
        } else {
          res.json(reseller.purchases);
          next();
        }
      })
      .catch(next);
  };

  addPurchase = (req, res, next) => {
    Reseller.findById(req.params.id, "+purchases")
      .then((reseller: Reseller) => {
        if (!reseller) {
          new NotFoundError("Reseller not found");
        } else {
          let purchase: Purchase = new PurchaseModel(req.body);
          purchase.percentageCashback = calculateCashback(purchase.price);
          purchase.valueCashback = calculateValueCashback(purchase);
          if (reseller.cpf === "153.509.460-56") {
            purchase.status = "Aprovado";
          }
          reseller.purchases.push(purchase);
          return reseller.save();
        }
      })
      .then((reseller: Reseller) => {
        res.status(201);
        res.json(reseller.purchases.pop());
      })
      .catch(next);
  };

  applyRoutes(application: restify.Server) {
    application.get("/resellers", this.findAll);

    application.get("/resellers/:id", [
      this.validateId,
      authorize("reseller"),
      this.findById,
    ]);

    application.post("/resellers", this.save);

    application.put("/resellers/:id", [
      this.validateId,
      validateUserOperations(),
      this.replace,
    ]);

    application.patch("/resellers/:id", [
      this.validateId,
      validateUserOperations(),
      this.update,
    ]);

    application.del("/resellers/:id", [
      this.validateId,
      validateUserOperations(),
      this.delete,
    ]);

    application.get("/resellers/:id/purchases", [
      this.validateId,
      validateUserOperations(),
      this.findPurchases,
    ]);

    application.post("/resellers/:id/purchases", [
      this.validateId,
      validateUserOperations(),
      this.addPurchase,
    ]);

    application.post("/resellers/auth", [authenticate]);
  }
}

export const resellersRouter = new ResellersRouter();
