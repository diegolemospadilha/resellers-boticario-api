import {
  calculateCashback,
  calculateValueCashback,
} from "./../../common/calculateCashback";
import { Purchase, PurchaseModel } from "../../purchases/purchase.model";

describe("Calculate percentage of cashbacks", () => {
  it("should return true 10% to purchase of R$1000, 00", () => {
    const result: number = calculateCashback(1000);
    expect(result).toBe(10);
  });

  it("should return true 15% to purchase of R$1500, 00", () => {
    const result: number = calculateCashback(1500);
    expect(result).toBe(15);
  });

  it("should return true 20% to purchase of R$1500, 00", () => {
    const result: number = calculateCashback(1501);
    expect(result).toBe(20);
  });
});

describe("Calculate value of cashbacks", () => {
  it("should return R$100,00 of value cashback to purchase of R$1000, 00", () => {
    let purchase: Purchase = new PurchaseModel();
    purchase.price = 1000;
    purchase.percentageCashback = calculateCashback(purchase.price);
    const result: number = calculateValueCashback(purchase);
    expect(result).toBe(100);
  });
  it("should return R$180,00 of value cashback to purchase of R$1200, 00", () => {
    let purchase: Purchase = new PurchaseModel();
    purchase.price = 1200;
    purchase.percentageCashback = calculateCashback(purchase.price);
    const result: number = calculateValueCashback(purchase);
    expect(result).toBe(180);
  });
  it("should return R$400,00 of value cashback to purchase of R$2000, 00", () => {
    let purchase: Purchase = new PurchaseModel();
    purchase.price = 2000;
    purchase.percentageCashback = calculateCashback(purchase.price);
    const result: number = calculateValueCashback(purchase);
    expect(result).toBe(400);
  });
});
