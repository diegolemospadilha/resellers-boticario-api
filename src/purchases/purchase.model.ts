import * as mongoose from "mongoose";
import { calculateValueCashback } from "../common/calculateCashback";

export interface Purchase extends mongoose.Document {
  code: string;
  price: number;
  date: Date;
  percentageCashback: number;
  valueCashback: number;
  status: string;
}

export const purchaseSchema = new mongoose.Schema({
  code: {
    type: String,
    minlength: 5,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  percentageCashback: {
    type: Number,
    min: 10,
    max: 20,
  },
  valueCashback: {
    type: Number,
    min: 0,
    max: 100000000,
  },
  status: {
    type: String,
    default: "Em validação",
  },
});

export const PurchaseModel = mongoose.model<Purchase>(
  "Purchase",
  purchaseSchema
);
