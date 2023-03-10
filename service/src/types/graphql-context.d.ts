import { Response } from "express";
import { RequestWithContext } from "./request-with-context";
import { AppContext } from "../services/auth/app-context";

export interface GraphQLContext {
  request: RequestWithContext;
  response: Response;
  context: AppContext;
}
