import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  forgotPassword,
  googleCallback,
  getCurrentUser,
  resetPassword,
} from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", register as any);
router.post("/login", login as any);
router.post("/logout", logout as any);
router.get("/logout", logout as any);
router.post("/forgot-password", forgotPassword as any);
router.post("/reset-password", resetPassword as any);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=auth_failed`,
  }),
  googleCallback
);

router.get("/me", auth, getCurrentUser);

export default router;
