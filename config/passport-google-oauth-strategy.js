const passport = require("passport");
const passportGoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/users");
const crypto = require("crypto");

passport.use(
    new passportGoogleStrategy(
        {
            clientID: "*",
            clientSecret: "*",
            callbackURL: "*",
        },
        function (accessToken, refreshToken, profile, done) {
            User.findOne({ email: profile.emails[0].value }).exec(function (
                err,
                user
            ) {
                if (err) {
                    console.log("Error in finding user: ", err);
                    return;
                }
                if (user) {
                    return done(null, user);
                } else {
                    let str = profile.displayName.split(" ");
                    if (str.length == 1) {
                        str[1] = "-";
                    }
                    if (str.length > 2) {
                        let localStr = "";
                        for (let i = 0; i < str.length - 1; i++) {
                            localStr += str[i];
                        }
                        str[0] = localStr;
                    }
                    User.create(
                        {
                            first_name: str[0],
                            last_name: str[1],
                            username: profile.displayName,
                            password: crypto.randomBytes(16).toString("hex"),
                            admin: false,
                            email: profile.emails[0].value,
                        },
                        function (err, user) {
                            if (err) {
                                console.log("Error in creating user:", err);
                                return;
                            }
                            return done(null, user);
                        }
                    );
                }
            });
        }
    )
);

module.exports = passport;
