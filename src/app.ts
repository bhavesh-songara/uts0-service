import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";

import { contextMiddleware } from "./utils/logger";
import { errorHandler, notFoundHandler, requestLogger } from "./middlewares";
import { apis } from "./routes";
import { GOOGLE_AUTH_CALLBACK_URL } from "./constants/Auth";
import { UserModel } from "./models/UserModel";
import { MongoDBConnector } from "./connectors/mongodb";

declare global {
  namespace Express {
    interface User {
      _id: string;
    }
  }
}

// Initializing express application
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MongoDBConnector.getMongoUrl(),
      dbName: "auth",
    }),
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: GOOGLE_AUTH_CALLBACK_URL,
      passReqToCallback: true,
    },
    async function (
      request: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      const email = profile?.email;
      const name = profile?.displayName;

      if (!email) {
        return done("Email not found", null);
      }

      const user = await UserModel.findOneAndUpdate(
        { email },
        { email, name },
        { upsert: true, new: true }
      );

      return done(null, {
        _id: user?._id?.toString(),
      });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user: any, done) {
  console.log("Serializing user", user);
  done(null, user);
});

passport.deserializeUser(function (obj: any, done) {
  console.log("Deserializing user", obj);
  done(null, obj);
});

app.use(contextMiddleware);
app.use(requestLogger);

app.use("/api", apis);
app.use("*", notFoundHandler);
app.use(errorHandler);

export default app;
