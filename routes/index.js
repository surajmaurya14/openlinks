const express = require("express");
const passport = require("passport");
const router = express.Router();

const homeController = require("../controllers/home_controller");

router.use("/users", require("./users"));
router.use("/categories", require("./categories"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));

router.get("/", passport.checkAuthentication, homeController.home);
router.get("/about", homeController.about);

router.get("/*", homeController.errorLink);

module.exports = router;
