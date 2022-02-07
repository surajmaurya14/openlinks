const express = require("express");
const { Passport } = require("passport");
const passport = require("passport");
const router = express.Router();

const commentsController = require("../controllers/comments_controller");

router.post("/create", passport.checkAuthentication, commentsController.create);
router.get("/delete/:commentId", passport.checkAuthentication, commentsController.delete);

module.exports = router;
