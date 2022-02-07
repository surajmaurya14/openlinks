const User = require("../models/users");

module.exports.profile = function (req, res) {
    let userProfile;
    if (req.params.userId == "self") {
        userProfile = req.user.id;
    } else {
        userProfile = req.params.userId;
    }

    User.findById(userProfile, function (err, user) {
        if (err) {
            console.log("Error in finding user");
            return;
        }
        return res.render("profile", {
            title: "Profile",
            userProfile: user,
        });
    });
};

module.exports.update = function (req, res) {
    if (req.user.id == req.params.profileId) {
        let first_name = req.user.first_name,
            last_name = req.user.last_name,
            admin = req.user.admin,
            username = req.user.username,
            password = req.user.password;

        if (req.body.first_name != "") {
            first_name = req.body.first_name;
        }
        if (req.body.last_name != "") {
            last_name = req.body.last_name;
        }

        if (req.body.accountType == "User Account") {
            admin = false;
        } else if (req.body.accountType == "Master Account") {
            if (req.body.masterKey == "*") {
                admin = true;
            }
        }
        if (req.body.new_password != "") {
            password = req.body.new_password;
        }
        if (req.body.username != "") {
            username = req.body.username;
        }

        User.findByIdAndUpdate(
            req.user.id,
            {
                first_name: first_name,
                last_name: last_name,
                admin: admin,
                password: password,
                username: username,
            },
            function (err, user) {
                if (err) {
                    console.log("Error in updating user profile");
                    return;
                }
                req.flash("successMessage", " Profile Updated");

                return res.redirect("back");
            }
        );
    } else {
        req.flash("failure Message", "Unauthorized Access");
        return res
            .status(401)
            .send("Unauthorized Access by you. Please try another request");
    }
};

module.exports.posts = function (req, res) {
    return res.render("posts", {
        title: "Posts",
    });
};

module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render("user_sign_in", {
        title: "Sign In",
    });
};

module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render("user_sign_up", {
        title: "Sign Up",
    });
};

module.exports.create = async function (req, res) {
    try {
        if (req.body.password != req.body.confirm_password) {
            return res.redirect("back");
        }
        let user = await User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }],
        });

        if (!user) {
            if (req.body.masterKey == "*") {
                req.body.admin = true;
            } else {
                req.body.admin = false;
            }
            await User.create(req.body);
            req.flash("successMessage", " Account Created");
            return res.redirect("/users/sign-in");
        } else {
            req.flash("failureMessage", "User exists");
            return res.redirect("back");
        }
    } catch (err) {
        console.log("Error: ", err);
        return;
    }
};
module.exports.createSession = function (req, res) {
    req.flash("successMessage", "Signed In");
    return res.redirect("/");
};

module.exports.signOut = function (req, res) {
    req.flash("successMessage", "Logged out");
    req.flash("failure", "Sign out Failed");
    req.logout();
    return res.redirect("/users/sign-in");
};
