import "jest";
import * as request from "supertest";
import { fail } from "assert";

let address: string = (<any>global).address;

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

test("put /resellers/:id", () => {
  request(address)
    .post("/resellers")
    .send({
      name: "Node.js Developer Boticario",
      email: "node.developer@boticario.com",
      password: "password",
      cpf: "878.776.890-98",
    })
    .then((response) =>
      request(address).put(`/users/${response.body._id}`).send({
        name: "Python Developer Boticario - PUT",
      })
    )
    .then((response) => {
      expect(response.status).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.name).toBe("Boticario Developer");
      expect(response.body.email).toBe("node.developer@boticario.com");
      expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});
