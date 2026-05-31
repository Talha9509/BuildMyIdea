import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {prismaClient} from "@repo/db/client";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${process.env.BACKEND}/auth/google/callback`,
  proxy:true
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile)
    const email = profile.emails?.[0]?.value;
    if(!email){
      return done(new Error("No email returned from google"))
    }
    const photo = profile.photos?.[0]?.value

    let user = await prismaClient.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          email, photo,
          name: profile.displayName,
          username: (profile.displayName + Math.round(Math.random()*100))
        }
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));