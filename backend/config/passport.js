const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const User = require('../models/User');

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id') {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/social-auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Update user's Google ID if not set
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      
      // Create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        role: 'donor', // Default role, can be changed later
        password: 'google-auth-' + Math.random().toString(36).substring(7) // Temporary password
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  // Fallback strategy for development
  passport.use('google', new GoogleStrategy({
    clientID: 'dev-client-id',
    clientSecret: 'dev-client-secret',
    callbackURL: "/api/social-auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    return done(new Error('Google OAuth not configured. Please set up Google OAuth credentials in your .env file.'), null);
  }));
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET && 
    process.env.FACEBOOK_APP_ID !== 'your_facebook_app_id') {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/social-auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Update user's Facebook ID if not set
        if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      
      // Create new user
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        facebookId: profile.id,
        role: 'donor', // Default role, can be changed later
        password: 'facebook-auth-' + Math.random().toString(36).substring(7) // Temporary password
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  // Fallback strategy for development
  passport.use('facebook', new FacebookStrategy({
    clientID: 'dev-app-id',
    clientSecret: 'dev-app-secret',
    callbackURL: "/api/social-auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails']
  }, (accessToken, refreshToken, profile, done) => {
    return done(new Error('Facebook OAuth not configured. Please set up Facebook OAuth credentials in your .env file.'), null);
  }));
}

// Apple Sign-In Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY_PATH && 
    process.env.APPLE_CLIENT_ID !== 'your_apple_client_id') {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: "/api/social-auth/apple/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, idToken, profile, done) => {
    try {
      // Apple doesn't provide email in profile, so we need to get it from the request
      const email = req.body?.user?.email || profile.email;
      
      if (!email) {
        return done(new Error('Email not provided by Apple'), null);
      }
      
      // Check if user already exists
      let user = await User.findOne({ email: email });
      
      if (user) {
        // Update user's Apple ID if not set
        if (!user.appleId) {
          user.appleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      
      // Create new user
      user = new User({
        name: profile.name?.firstName + ' ' + profile.name?.lastName || 'Apple User',
        email: email,
        appleId: profile.id,
        role: 'donor', // Default role, can be changed later
        password: 'apple-auth-' + Math.random().toString(36).substring(7) // Temporary password
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  // Fallback strategy for development
  passport.use('apple', new AppleStrategy({
    clientID: 'dev-apple-client-id',
    teamID: 'dev-team-id',
    keyID: 'dev-key-id',
    privateKeyLocation: './dev-key.p8',
    callbackURL: "/api/social-auth/apple/callback",
    passReqToCallback: true
  }, (req, accessToken, refreshToken, idToken, profile, done) => {
    return done(new Error('Apple Sign-In not configured. Please set up Apple Sign-In credentials in your .env file.'), null);
  }));
}

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 