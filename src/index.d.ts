import { Reseller } from "./resellers/reseller.model";

declare module "restify" {
  export interface Request {
    authenticated: Reseller;
  }
}
