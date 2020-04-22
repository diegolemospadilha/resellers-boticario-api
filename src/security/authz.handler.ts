import { Reseller } from "./../resellers/reseller.model";
import { ForbiddenError } from "restify-errors";
import * as restify from "restify";

export const authorize: (...profiles: string[]) => restify.RequestHandler = (
  ...profiles
) => {
  return (req, resp, next) => {
    if (
      req.authenticated !== undefined &&
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
  Reseller.findById(req.params.id).then((reseller) => {
    if (reseller.id === req.authenticated.id) {
      next();
    } else {
      next(new ForbiddenError("Permission denied"));
    }
  });
};
