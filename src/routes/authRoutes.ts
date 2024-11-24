import { Request, Response, Router } from "express";
import passport from "passport";
import asyncFunction from "express-async-handler";
import {
  GOOGLE_AUTH_FAILURE_REDIRECT_URL,
  GOOGLE_AUTH_SUCCESS_REDIRECT_URL,
} from "../constants/Auth";

import { UserModel } from "../models/UserModel";
import createHttpError from "http-errors";
import { ensureAuthenticated } from "../middlewares/auth";

export const authApis = Router();

// Define your routes here
authApis.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authApis.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: GOOGLE_AUTH_SUCCESS_REDIRECT_URL,
    failureRedirect: GOOGLE_AUTH_FAILURE_REDIRECT_URL,
  })
);

authApis.get(
  "/logout",
  asyncFunction((req: Request, res: Response) => {
    req.logout(
      {
        keepSessionInfo: false,
      },
      (err) => {
        if (err) {
          throw new createHttpError.InternalServerError("Logout failed");
        } else {
          res.send({
            message: "Logged out successfully",
          });
        }
      }
    );
  })
);

authApis.get(
  "/me",
  ensureAuthenticated,
  asyncFunction(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const user = await UserModel.findOne({ _id: userId });

    res.send({
      user,
    });
  })
);
