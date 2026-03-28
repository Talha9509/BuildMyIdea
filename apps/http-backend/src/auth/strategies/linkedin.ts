// import passport from "passport";
// import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
// import { prismaClient } from "@repo/db/client";

// passport.use(new LinkedInStrategy({
//   clientID: process.env.LINKEDIN_CLIENT_ID!,
//   clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
//   callbackURL: "/auth/linkedin/callback",
//   scope: ["openid", "profile", "email"],   
// },
// async (accessToken, refreshToken, profile, done) => {
//   try {
//     const email = profile.emails?.[0]?.value;
//     if (!email) return done(new Error("No email returned from LinkedIn"));

//     const photo = profile.photos?.[0]?.value ?? null;

//     let user = await prismaClient.user.findUnique({ where: { email } });

//     if (!user) {
//       user = await prismaClient.user.create({
//         data: {
//           email, photo,
//           name: profile.displayName,
//         }
//       });
//     }

//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// }));