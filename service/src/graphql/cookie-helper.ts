import * as Express from "express";
import { sign } from "jsonwebtoken";

export function getAuthCookieName() {
  return "auth";
}

function getCookieDomain() {
    return "localhost";
}

export async function setAuthCookie(_request: Express.Request, response: Express.Response, userId: number) {
  //TODO: get it from env
  const jwtSecret = "godisgreat";

  const ourToken = sign({}, jwtSecret, {
    subject: userId.toString(),
    issuer: "ggtech",
  });

  response.cookie(getAuthCookieName(), ourToken, {
    httpOnly: true,
    domain: getCookieDomain(),
    secure: true,
    sameSite: "none"
  });
}

export async function clearAuthCookie(_request: Express.Request, response: Express.Response) {
  response.clearCookie(getAuthCookieName(), {
    httpOnly: true,
    domain: getCookieDomain(),
    secure: true,
    expires: new Date(),
  });
}
