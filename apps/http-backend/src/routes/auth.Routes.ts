import express, { Router } from "express";
import jwt from "jsonwebtoken";
import passport from '../auth/passport.js'

const router:Router = express.Router();

const signTokenAndRedirect = (req: any, res: any) => {
  const user = req.user as any;
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "72h" });
  res.status(201).cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 72 * 60 * 60 * 1000
  }).redirect(`${process.env.FRONTEND}/projects`);
};

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), signTokenAndRedirect);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false }), signTokenAndRedirect);

export default router;