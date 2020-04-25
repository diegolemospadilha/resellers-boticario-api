import { validateCPF } from "./../../common/validators";

describe("CPF Validator", () => {
  it("should return true to valid CPF", () => {
    const result: boolean = validateCPF("918.457.976-55");
    expect(result).toBeTruthy;
  });
  it("should return false to invalid CPF", () => {
    const result: boolean = validateCPF("111.111.976-00");
    expect(result).toBeFalsy;
  });
  it("should return false to null CPF", () => {
    const result: boolean = validateCPF(null);
    expect(result).toBeFalsy;
  });
});
