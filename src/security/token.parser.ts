import { Reseller } from "./../resellers/reseller.model";
import * as restify from "restify";
import * as jwt from "jsonwebtoken";
import { environment } from "./../common/environment";

export const tokenParser: restify.RequestHandler = (req, resp, next) => {
  const token = extractToken(req);
  if (token) {
    jwt.verify(token, environment.security.apiSecret, applyBearer(req, next));
  } else {
    next();
  }
};

function extractToken(request: restify.Request): string {
  let token = undefined;
  const authorization = request.header("authorization");
  if (authorization) {
    const parts: string[] = authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }
  return token;
}

function applyBearer(
  request: restify.Request,
  next: restify.Next
): (error, decoded) => void {
  return (error, decoded) => {
    if (decoded) {
      Reseller.findByEmail(decoded.sub)
        .then((reseller) => {
          if (reseller) {
            request.authenticated = reseller;
          }
          next();
        })
        .catch(next);
    } else {
      next();
    }
  };
}
