const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            passReqToCallback: true, // Allows access to req object
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                console.log("Google Profile:", profile);

                if (!user) {
                    const role = req.session.role || "patient"; // Default role

                    user = new User({
                        googleId: profile.id, // Save Google ID
                        email: profile.emails[0].value,
                        fullName: `${profile.name.givenName || ""} ${profile.name.familyName || ""}`.trim(),
                        role: role,
                    });

                    await user.save();
                }

                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.googleId); // Serialize with Google ID
});

passport.deserializeUser(async (googleId, done) => {
    try {
        const user = await User.findOne({ googleId });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
