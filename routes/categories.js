const express = require("express");
const passport = require("passport");
const router = express.Router();

const categoryController = require("../controllers/category_controller");

router.post(
    "/create-category",
    passport.checkAuthentication,
    categoryController.createCategory
);
router.get(
    "/delete/:categoryId",
    passport.checkAuthentication,
    categoryController.deleteCategory
);

router.get(
    "/:categoryName",
    passport.checkAuthentication,
    categoryController.getCategory
);
router.get("/", passport.checkAuthentication, categoryController.category);

module.exports = router;
