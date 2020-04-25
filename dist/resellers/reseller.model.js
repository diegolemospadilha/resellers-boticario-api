"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const purchase_model_1 = require("./../purchases/purchase.model");
const environment_1 = require("../common/environment");
const validators_1 = require("./../common/validators");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const resellerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 4,
        maxlength: 80,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true,
    },
    password: {
        type: String,
        select: false,
        minlength: 6,
        required: true,
    },
    cpf: {
        type: String,
        required: false,
        unique: true,
        match: /[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/,
        validate: {
            validator: validators_1.validateCPF,
            message: "Invalid CPF: {VALUE}",
        },
    },
    purchases: {
        type: [purchase_model_1.purchaseSchema],
        select: false,
        required: false,
    },
    profiles: {
        type: [String],
        default: ["reseller"],
        select: true,
    },
});
resellerSchema.statics.findByEmail = function (email, projection) {
    return this.findOne({ email }, projection);
};
resellerSchema.methods.matches = function (password) {
    return bcrypt.compareSync(password, this.password);
};
resellerSchema.methods.hasAny = function (...profiles) {
    return profiles.some((profile) => this.profiles.indexOf(profile) !== -1);
};
const hashPassword = (obj, next) => __awaiter(this, void 0, void 0, function* () {
    bcrypt
        .hash(obj.password, environment_1.environment.security.saltRounds)
        .then((hash) => {
        obj.password = hash;
        next();
    })
        .catch(next);
});
const saveMiddleware = function (next) {
    let reseller = this;
    if (!reseller.isModified("password")) {
        next();
    }
    else {
        hashPassword(reseller, next);
    }
};
const updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        next();
    }
    else {
        hashPassword(this.getUpdate(), next);
    }
};
resellerSchema.pre("save", saveMiddleware);
resellerSchema.pre("findByIdAndUpdate", updateMiddleware);
resellerSchema.pre("updateOne", updateMiddleware);
exports.Reseller = mongoose.model("Reseller", resellerSchema);
