import { Router, Request, Response } from "express";
import { auth } from "express-openid-connect";

import config from "../../config";
import {
  AUTH0_LOGIN_SUCCESS_URL,
  AUTH0_BASE_URL,
  AUTH0_CALLBACK_URL,
  AUTH0_LOGOUT_URL,
} from "../constants/Auth0";
import { logger } from "../utils/logger";

export const authApis = Router();

authApis.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET as string,
    baseURL: AUTH0_BASE_URL,
    clientID: config.auth0.clientId,
    issuerBaseURL: config.auth0.domain,
    routes: {
      login: false,
      logout: false,
    },
  })
);

authApis.get("/login", (req: Request, res: Response) => {
  res.oidc.login({
    returnTo: AUTH0_LOGIN_SUCCESS_URL,
    authorizationParams: {
      redirect_uri: AUTH0_CALLBACK_URL,
    },
  });
});

authApis.get("/callback", (req: Request, res: Response) => {
  res.oidc.callback({
    redirectUri: AUTH0_LOGIN_SUCCESS_URL,
  });
});

authApis.post("/callback", (req: Request, res: Response) => {
  res.oidc.callback({
    redirectUri: AUTH0_LOGIN_SUCCESS_URL,
  });
});

authApis.get("/logout", (req: Request, res: Response) => {
  res.oidc.logout({
    returnTo: AUTH0_LOGOUT_URL,
  });
});

authApis.get("/me", (req: Request, res: Response) => {
  const isAuth = req.oidc.isAuthenticated();
  const user = req.oidc?.user;
  res.send({ user, isAuthenticated: isAuth });
});
