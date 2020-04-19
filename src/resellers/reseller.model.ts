import { environment } from "../common/environment";
import { validateCPF } from "./../common/validators";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { userInfo } from "os";

export interface Reseller extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  status: string;
}
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
    validate: {
      validator: validateCPF,
      message: "Invalid CPF: {VALUE}",
    },
  },
  status: {
    type: String,
    default: "Em validação",
  },
});

const hashPassword = async (obj, next) => {
  bcrypt
    .hash(obj.password, environment.security.saltRounds)
    .then((hash) => {
      obj.password = hash;
      next();
    })
    .catch(next);
};
const saveMiddleware = function (next) {
  const reseller: Reseller = this;
  if (!reseller.isModified("password")) {
    next();
  } else {
    hashPassword(reseller, next);
  }
};

const updateMiddleware = function (next) {
  if (!this.getUpdate().password) {
    next();
  } else {
    hashPassword(this.getUpdate(), next);
  }
};

resellerSchema.pre("save", saveMiddleware);
resellerSchema.pre("findByIdAndUpdate", updateMiddleware);
resellerSchema.pre("updateOne", updateMiddleware);
export const Reseller = mongoose.model<Reseller>("Reseller", resellerSchema);
