import { Reseller } from "../../resellers/reseller.model";
import "jest";
import * as request from "supertest";
import { fail } from "assert";

let address: string = (<any>global).address;
let auth: string = (<any>global).auth;

describe("GET / resellers", () => {
  it("should be able to list all resellers", async () => {
    const response = await request(address).get("/resellers");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should be able recused request with invalid ID", async () => {
    const response = await request(address).get("/resellers/aaaaaa");
    expect(response.status).toBe(403);
  });

  it("should be able create a new reseller", async () => {
    const reseller = new Reseller();
    (reseller.name = "Boticario Developer"),
      (reseller.email = "developer@boticario.com"),
      (reseller.password = "password"),
      (reseller.cpf = "153.509.460-56");
    const response = await request(address).post("/resellers").send(reseller);
    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe("Boticario Developer");
    expect(response.body.email).toBe("developer@boticario.com");
    expect(response.body.cpf).toBe("153.509.460-56");
    expect(response.body.password).toBeUndefined();
  });
});
