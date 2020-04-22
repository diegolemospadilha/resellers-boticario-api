import { Reseller } from "./../resellers/reseller.model";
import { NotAuthorizedError } from "restify-errors";
import * as restify from "restify";
import * as jwt from "jsonwebtoken";
import { environment } from "./../common/environment";

export const authenticate: restify.RequestHandler = (req, resp, next) => {
  const { email, password } = req.body;

  Reseller.findByEmail(email, "+password")
    .then((reseller) => {
      if (reseller && reseller.matches(password)) {
        // gerar token
        const token = jwt.sign(
          { sub: reseller.email, iss: "resellers-bot-api" },
          environment.security.apiSecret
        );
        resp.json({
          name: reseller.name,
          email: reseller.email,
          accessToken: token,
        });
      } else {
        return next(new NotAuthorizedError("Invalid Credentials"));
      }
    })
    .catch(next);
};
