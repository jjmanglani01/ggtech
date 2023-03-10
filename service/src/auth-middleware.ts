import express from "express";
import { RequestWithContext } from "./types/request-with-context";
import { getViewer } from "./services/auth/viewer";
import { AppContext } from "./services/auth/app-context";
import { clearAuthCookie, getAuthCookieName } from "./graphql/cookie-helper";
import { JsonWebTokenError } from "jsonwebtoken";
import { v4 as uuid } from "uuid";

export default async (req: RequestWithContext, res: express.Response, next: express.NextFunction) => {
  try {
    const context: AppContext = {
      requestId: uuid(),
      viewer: null,
    };

    // If an "Authorization" header is not present on the request, skip processing and forward request to next middleware
    if (!req.cookies[getAuthCookieName()]) {
      req.context = context;
      return next();
    }

    context.viewer = await getViewer({
      jwtToken: req.cookies[getAuthCookieName()],
      requestId: context.requestId,
    });

    req.context = context;

    return next();
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      clearAuthCookie(req, res);
    }
    next(e);
  }
};
