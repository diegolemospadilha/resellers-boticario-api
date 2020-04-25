import * as jestCli from "jest-cli";
import { Server } from "./server/server";
import { environment } from "./common/environment";
import { resellersRouter } from "./resellers/reseller.router";
import { Reseller } from "./resellers/reseller.model";
import "jest";
let server: Server;

const beforeAllTests = () => {
  environment.db.url =
    process.env.DB_URL || "mongodb://localhost/resellers-boticario-test-db";
  environment.server.port = process.env.SERVER_PORT || 3001;
  server = new Server();
  return server
    .bootstrap([resellersRouter])
    .then(() => Reseller.deleteMany({}))
    .then(() => {
      let reseller1 = new Reseller();
      (reseller1.name = "Reseller Tester 1"),
        (reseller1.email = "reseller1@email.com"),
        (reseller1.password = "password"),
        (reseller1.profiles = ["reseller"]);
      return reseller1.save();
    });
};

const afterAllTests = () => {
  return server.shutdown();
};

beforeAllTests()
  .then(() => jestCli.run())
  .then(() => afterAllTests())
  .catch(console.error);
