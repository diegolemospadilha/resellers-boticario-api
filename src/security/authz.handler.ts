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
      console.log("profiles: ", ...profiles);
      next();
    } else {
      next(new ForbiddenError("Permission denied"));
    }
  };
};

export const validateUserOperations: () => restify.RequestHandler = () => (
  req: restify.Request,
  resp,
  next
) => {
  //@ts-ignore
  Reseller.findById(req.authenticated._id)
    .then((reseller) => {
      //@ts-ignore
      if (reseller.email === req.authenticated.email) {
        next();
      } else {
        next(new ForbiddenError("Permission denied"));
      }
    })
    .catch(next);
};
