import { Router } from "./routes";
import * as mongoose from "mongoose";
import { NotFoundError } from "restify-errors";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
  pageSize: number = 2;

  constructor(protected model: mongoose.Model<D>) {
    super();
  }

  validateId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid) {
      next(new NotFoundError("Document not found"));
    } else {
      next();
    }
  };
  findAll = (req, res, next) => {
    this.model.find().then(this.renderAll(res, next));
  };

  findById = (req, res, next) => {
    this.model
      .findById(req.params.id)
      .then(this.render(req, res, next))
      .catch(next);
  };

  save = (req, res, next) => {
    let user = new this.model(req.body);
    user.save().then(this.render(req, res, next)).catch(next);
  };

  replace = (req, res, next) => {
    const options = { runValidators: true, new: true };
    this.model
      .updateOne({ _id: req.params.id }, req.body, options)
      .exec()
      .then((result) => {
        if (result.n) {
          return this.model.findById(req.params.id);
        } else {
          throw new NotFoundError("Document not found");
        }
      })
      .then(this.render(req, res, next))
      .catch(next);
  };

  update = (req, res, next) => {
    const options = { runValidators: true, new: true };
    this.model
      .findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(req, res, next))
      .catch(next);
  };

  delete = (req, res, next) => {
    this.model
      .deleteOne({ _id: req.params.id })
      .then((cmdResult: any) => {
        if (cmdResult.n) {
          res.send(204);
        } else {
          throw new NotFoundError("Document not found");
        }
        return next();
      })
      .catch(next);
  };
}
