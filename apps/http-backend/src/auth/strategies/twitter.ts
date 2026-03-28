import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { prismaClient } from "@repo/db/client";

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CLIENT_ID!,
  consumerSecret: process.env.TWITTER_CLIENT_SECRET!,
  callbackURL: "/auth/twitter/callback",
  includeEmail: true   // ← must set this, otherwise email is never returned
},
async (token, tokenSecret, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value ?? `twitter_${profile.id}@noreply.twitter.com`;

    // Twitter returns _normal suffix on photo URLs for low-res (48x48)
    // Replace it with nothing to get the original full resolution
    const rawPhoto = profile.photos?.[0]?.value ?? null;
    const photo = rawPhoto ? rawPhoto.replace("_normal", "") : null;

    let user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          email,
          name: profile.displayName,
          photo,
        }
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));