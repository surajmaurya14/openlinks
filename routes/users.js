const express = require("express");
const passport = require("passport");
const { setMessage } = require("../config/messageMiddleware");
const router = express.Router();

const users_controller = require("../controllers/users_controller");
router.get("/profile", passport.checkAuthentication, users_controller.profile);

router.get(
    "/profile/:userId",
    passport.checkAuthentication,
    users_controller.profile
);
router.get("/posts", users_controller.posts);
router.get("/sign-in", users_controller.signIn);
router.get("/sign-up", users_controller.signUp);
router.get("/sign-out", users_controller.signOut);

router.post(
    "/create-session",
    passport.authenticate("local", {
        failureRedirect: "/users/sign-in",
        failureFlash: true,
    }),
    users_controller.createSession
);
router.post("/create", users_controller.create);
router.post(
    "/update/:profileId",
    passport.checkAuthentication,
    users_controller.update
);

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
    users_controller.createSession
);

module.exports = router;
