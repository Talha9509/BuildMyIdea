import express, { Router } from "express";
import jwt from "jsonwebtoken";
import passport from '../auth/passport.js'

const router:Router = express.Router();



const signTokenAndRedirect = (req: any, res: any) => {
  const user = req.user as any;
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "72h" });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  }).redirect("/projects");
};

// GOOGLE
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), signTokenAndRedirect);

// GITHUB
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false }), signTokenAndRedirect);

// TWITTER / X
router.get("/twitter", passport.authenticate("twitter"));
router.get("/twitter/callback", passport.authenticate("twitter", { session: false }), signTokenAndRedirect);

// LINKEDIN
// router.get("/linkedin", passport.authenticate("linkedin"));
// router.get("/linkedin/callback", passport.authenticate("linkedin", { session: false }), signTokenAndRedirect);

export default router;