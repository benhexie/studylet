import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Find existing user
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          return done(null, user);
        }

        // Create new user if doesn't exist
        user = await User.create({
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          email: profile.emails?.[0].value,
          password: Math.random().toString(36).slice(-8), // Random password
          avatar: profile.photos?.[0].value,
        });

        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

export default passport;
