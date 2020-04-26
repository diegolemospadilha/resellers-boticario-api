import { environment } from "./../common/environment";
import { authorize, validateUserOperations } from "./../security/authz.handler";
import {
  calculateCashback,
  calculateValueCashback,
} from "./../common/calculateCashback";
import { Purchase, PurchaseModel } from "./../purchases/purchase.model";
import { NotFoundError, BadRequestError } from "restify-errors";
import { Reseller } from "./reseller.model";
import { ModelRouter } from "../common/model-router";
import * as restify from "restify";
import { authenticate } from "../security/auth.handler";
import * as request from "request";
class ResellersRouter extends ModelRouter<Reseller> {
  constructor() {
    super(Reseller);
    this.on("beforeRender", (document) => {
      document.password = undefined;
      document.purchases = undefined;
      document.profiles = undefined;
    });
  }

  getCashback = (req, res, next) => {
    if (req.query.cpf) {
      let cpf: string = req.query.cpf
        .replace(".", "")
        .replace(".", "")
        .replace("-", "");
      if (cpf.length === 11) {
        console.log("cpf: ", cpf);
        var options = {
          method: "GET",
          url: `${environment.bot.url}/cashback?cpf=${cpf}`,
          headers: {
            authorization: environment.bot.token,
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
      } else {
        return next(new BadRequestError("Invalid CPF"));
      }
    } else {
      return next(new BadRequestError("CPF is required"));
    }
  };

  findPurchases = (req, res, next) => {
    Reseller.findById(req.params.id, "+purchases")
      .then((reseller) => {
        if (!reseller) {
          return new NotFoundError("Reseller not found");
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
      validateUserOperations(),
      this.findById,
    ]);

    application.post("/resellers", this.save);

    application.put("/resellers/:id", [
      this.validateId,
      authorize("reseller"),
      validateUserOperations(),
      this.replace,
    ]);

    application.patch("/resellers/:id", [
      this.validateId,
      authorize("reseller"),
      validateUserOperations(),
      this.update,
    ]);

    application.del("/resellers/:id", [
      this.validateId,
      authorize("reseller"),
      validateUserOperations(),
      this.delete,
    ]);

    application.get("/resellers/:id/purchases", [
      this.validateId,
      authorize("reseller"),
      validateUserOperations(),
      this.findPurchases,
    ]);

    application.post("/resellers/:id/purchases", [
      this.validateId,
      authorize("reseller"),
      validateUserOperations(),
      this.addPurchase,
    ]);

    application.post("/resellers/auth", [authenticate]);

    application.get("/resellers/cashback", this.getCashback);
  }
}

export const resellersRouter = new ResellersRouter();
