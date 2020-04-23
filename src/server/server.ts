import { logger } from "./../common/logger";
import { tokenParser } from "./../security/token.parser";
import { environment } from "../common/environment";
import * as restify from "restify";
import { Router } from "./../common/routes";
import * as mongoose from "mongoose";
import { mergePatchBodyParser } from "./merge-patch.parser";
import { handlerError } from "./error.handler";

export class Server {
  application: restify.Server;

  initializeDb(): Promise<any> {
    return mongoose.connect(environment.db.url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  }
  initRoutes(routes: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "reseller-bot-api",
          version: "1.0.0",
          log: logger,
        });

        this.application.pre(
          restify.plugins.requestLogger({
            log: logger,
          })
        );
        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);
        this.application.use(tokenParser);

        // applying routes
        for (let router of routes) {
          router.applyRoutes(this.application);
        }

        this.application.listen(environment.server.port, () =>
          resolve(this.application)
        );

        this.application.on("restifyError", handlerError);
      } catch (error) {}
    });
  }
  bootstrap(routes: Router[] = []): Promise<Server> {
    return this.initializeDb().then(() =>
      this.initRoutes(routes).then(() => this)
    );
  }

  shutdown() {
    mongoose.disconnect().then(() => this.application.close());
  }
}
