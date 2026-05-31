import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import {prismaClient} from "@repo/db/client";

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: `${process.env.BACKEND}/auth/github/callback`,
  proxy:true
},
async (accessToken:any, refreshToken:any, profile:any, done:any) => {
  try {
    console.log(profile)
    const email = profile.emails?.[0].value;

    let user = await prismaClient.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          email: email ?? `github_${profile.username+Math.random()}@noreply.com`,
          name: profile.username,
          username: (profile.username + Math.round(Math.random()*100))
        }
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));