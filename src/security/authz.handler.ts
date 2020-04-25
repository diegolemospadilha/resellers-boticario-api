import { Reseller } from "./../resellers/reseller.model";
import { ForbiddenError } from "restify-errors";
import * as restify from "restify";

export const authorize: (...profiles: string[]) => restify.RequestHandler = (
  ...profiles
) => {
  return (req, resp, next) => {
    if (
      //@ts-ignore
      req.authenticated !== undefined &&
      //@ts-ignore
      req.authenticated.hasAny(...profiles)
    ) {
      next();
    } else {
      next(new ForbiddenError("Permission denied"));
    }
  };
};

export const validateUserOperations: () => restify.RequestHandler = () => (
  req,
  resp,
  next
) => {
  //@ts-ignore
  Reseller.findById(req.authenticated._id)
    .then((reseller) => {
      console.log("reseler aqui", reseller);
      //@ts-ignore
      if (reseller._id === req.authenticated._id) {
        next();
      } else {
        next(new ForbiddenError("Permission denied"));
      }
    })
    .catch(next);
};
