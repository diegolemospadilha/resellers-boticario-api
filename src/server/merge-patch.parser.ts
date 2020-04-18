import * as restify from "restify";
import { BadRequestError } from "restify-errors";
const mpContentType = "application/merge-path+json";

export const mergePatchBodyParser = (
  req: restify.Request,
  resp: restify.Response,
  next
) => {
  if (req.getContentType() === mpContentType && req.method === "PATCH") {
    (<any>req).rawBody = req.body;
    try {
      req.body = JSON.parse(req.body);
    } catch (error) {
      next(new BadRequestError(`Invalid content: ${error.message}`));
    }
  }

  return next();
};
