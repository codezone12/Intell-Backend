import passport from "passport";
import {
  Profile,
  Strategy,
  StrategyOptionsWithRequest
} from "passport-google-oauth20";
import User from "../models/User";

const clientConfigs = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: "/auth/google/callback", // Must match the configured redirect URI
  passReqToCallback: true
};
const googleStrategyCallback = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    let dbUser = await User.findOne({ googleId: profile.id });
    if (!dbUser) {
      dbUser = new User();
      await dbUser.save();
    }

    return done(null, dbUser);
  } catch (error) {
    done(error);
  }
};
const GoogleStrategy = new Strategy(clientConfigs, googleStrategyCallback);
passport.use(GoogleStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const dbUser = await User.findById(id);
    done(null, dbUser);
  } catch (error) {
    done(error);
  }
});
