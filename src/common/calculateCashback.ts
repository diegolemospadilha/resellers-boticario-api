import { Purchase } from "../purchases/purchase.model";

export const calculateCashback = (price: Number): number => {
  if (price < 1001) {
    return 10;
  } else if (price > 1000 && price < 1501) {
    return 15;
  } else {
    return 20;
  }
};

export const calculateValueCashback = (purchase: Purchase): number => {
  return Number.parseFloat(
    ((purchase.percentageCashback * purchase.price) / 100).toPrecision(2)
  );
};
