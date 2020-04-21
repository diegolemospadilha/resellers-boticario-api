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
    .then(() => Reseller.deleteMany({}));
};

const afterAllTests = () => {
  return server.shutdown();
};

beforeAllTests()
  .then(() => jestCli.run())
  .then(() => afterAllTests())
  .catch(console.error);
