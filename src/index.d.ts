import { Reseller } from "./resellers/reseller.model";
import * as superagent from "superagent";

declare module "restify" {
  export interface Request {
    authenticated: Reseller;
  }
}
