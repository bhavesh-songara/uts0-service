import { Router } from "express";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authApis = Router();

const githubProvider = GithubProvider({
  clientId: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
});

authApis.use(
  NextAuth({
    providers: [githubProvider],
  })
);
