import { environment } from "../common/environment";
import { validateCPF } from "./../common/validators";
import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

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
    maxlength: 8,
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

const hashPassword = async (passwd, next) => {
  passwd = await bcrypt.hashSync(passwd, environment.security.saltRounds);
  next();
};
const saveMiddleware = function (next) {
  const reseller: Reseller = this;
  if (!reseller.isModified("password")) {
    next();
  } else {
    hashPassword(reseller.password, next);
  }
};

const updateMiddleware = function (next) {
  if (!this.getUpdate().password) {
    next();
  } else {
    hashPassword(this.getUpdate().password, next);
  }
};

resellerSchema.pre("save", saveMiddleware);
resellerSchema.pre("findByIdAndUpdate", updateMiddleware);
resellerSchema.pre("updateOne", updateMiddleware);
export const Reseller = mongoose.model<Reseller>("Reseller", resellerSchema);
