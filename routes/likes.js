const express = require("express");
const router = express.Router();

const likesController = require("../controllers/likes_controller");

router.get("/status", likesController.likeStatus);
module.exports = router;
