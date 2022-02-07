const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/users");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },

        function (req, email, password, done) {
            User.findOne({ email: email }, function (err, user) {
                if (err) {
                    req.flash("failureMessage", "Error in finding user");
                    console.log("Error in finding user");
                    return done(err);
                }

                if (!user || user.password != password) {
                    req.flash("failureMessage", "Invalid Email or Password");
                    return done(null, false);
                }

                return done(null, user);
            });
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log("Error in finding the user");
            return done(err);
        }

        return done(null, user);
    });
});

passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect("/users/sign-in");
    }
};

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user; //user data saved in req.user by passport, giving that prop to locals for use in views
    }
    next();
};

module.exports = passport;
