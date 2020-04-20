import { resellersRouter } from "./reseller.router";
import { Reseller } from "./reseller.model";
import "jest";
import * as request from "supertest";
import { fail } from "assert";
import { Server } from "../server/server";
import { environment } from "../common/environment";

let server: Server;
let address: string;
beforeAll(() => {
  environment.db.url =
    process.env.DB_URL || "mongodb://localhost/resellers-boticario-test-db";
  environment.server.port = process.env.SERVER_PORT || 3001;
  address = `http://localhost:${environment.server.port}`;
  server = new Server();
  server
    .bootstrap([resellersRouter])
    .then(() => Reseller.remove({}).exec())
    .catch(console.error);
});

test("get /resellers", () => {
  request(address)
    .get("/resellers")
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    })
    .catch(fail);
});

test("get /resellers/acacaca - with invalid ID", () => {
  request(address)
    .get("/resellers")
    .then((response) => {
      expect(response.status).toBe(404);
    })
    .catch(fail);
});

test("post /resellers", () => {
  request(address)
    .post("/resellers")
    .send({
      name: "Boticario Developer",
      email: "developer@boticario.com",
      password: "password",
      cpf: "153.509.460-56",
    })
    .then((response) => {
      expect(response.status).toBe(201);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("Boticario Developer");
      expect(response.body.email).toBe("developer@boticario.com");
      expect(response.body.cpf).toBe("153.509.460-56");
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});

afterAll(() => {
  return server.shutdown();
});
