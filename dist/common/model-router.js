"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const mongoose = require("mongoose");
const restify_errors_1 = require("restify-errors");
class ModelRouter extends routes_1.Router {
    constructor(model) {
        super();
        this.model = model;
        this.pageSize = 2;
        this.validateId = (req, res, next) => {
            if (!mongoose.Types.ObjectId.isValid) {
                next(new restify_errors_1.NotFoundError("Document not found"));
            }
            else {
                next();
            }
        };
        this.findAll = (req, res, next) => {
            this.model.find().then(this.renderAll(res, next));
        };
        this.findById = (req, res, next) => {
            this.model
                .findById(req.params.id)
                .then(this.render(req, res, next))
                .catch(next);
        };
        this.save = (req, res, next) => {
            let user = new this.model(req.body);
            user.save().then(this.render(req, res, next)).catch(next);
        };
        this.replace = (req, res, next) => {
            const options = { runValidators: true, new: true };
            this.model
                .updateOne({ _id: req.params.id }, req.body, options)
                .exec()
                .then((result) => {
                if (result.n) {
                    return this.model.findById(req.params.id);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Document not found");
                }
            })
                .then(this.render(req, res, next))
                .catch(next);
        };
        this.update = (req, res, next) => {
            const options = { runValidators: true, new: true };
            this.model
                .findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(req, res, next))
                .catch(next);
        };
        this.delete = (req, res, next) => {
            this.model
                .deleteOne({ _id: req.params.id })
                .then((cmdResult) => {
                if (cmdResult.n) {
                    res.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Document not found");
                }
                return next();
            })
                .catch(next);
        };
    }
}
exports.ModelRouter = ModelRouter;
