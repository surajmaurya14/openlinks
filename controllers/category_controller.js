const Category = require("../models/category");
const Post = require("../models/posts");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.category = function (req, res) {
    Category.find({})
        .sort({ name: 1 })
        .exec(function (err, categories) {
            if (err) {
                console.log("Error in finding Categories");
                return;
            }
            return res.render("categories", {
                title: "Categories",
                categories: categories,
            });
        });
};
module.exports.createCategory = async function (req, res) {
    let categoryName = req.body.category;
    try {
        let category = await Category.findOne({ name: categoryName });
        if (req.user.admin == false) {
            req.flash("failureMessage", "You are not an admin");
            return res.redirect("back");
        } else if (category != null) {
            req.flash("failureMessage", "Category Exists");
            return res.redirect("back");
        } else {
            await Category.create({
                name: req.body.category,
                user: req.user.id,
            });
            req.flash(
                "successMessage",
                "Category: '" + req.body.category + "' added"
            );
            return res.redirect("back");
        }
    } catch (err) {
        console.log("Error: ", err);
        return;
    }
};

module.exports.getCategory = async function (req, res) {
    try {
        let categoryId;
        let category = await Category.findOne({
            name: req.params.categoryName,
        });
        categoryId = category._id;
        let posts = await Post.find({ category: categoryId })
            .sort({ createdAt: -1 })
            .populate("user")
            .populate({
                path: "comments",
                options: { sort: { createdAt: 1 } },
                populate: {
                    path: "user",
                },
            });

        return res.render("posts", {
            title: "Posts",
            pageCategory: req.params.categoryName,
            posts: posts,
        });
    } catch (err) {
        console.log("Error: ", err);
        return;
    }
};

module.exports.deleteCategory = async function (req, res) {
    try {
        let categoryId = req.params.categoryId;
        let category = await Category.findById(categoryId);
        let name = category.name;

        if (category.user == req.user.id) {
            let posts = await Post.find({ category: categoryId });
            // console.log(posts);
            for (let i of posts) {
                let postId = i._id;
                for (let j of i.comments) {
                    await Like.deleteMany({ likedOn: j });
                }

                await Like.deleteMany({ likedOn: postId });
                i.remove();
                await Comment.deleteMany({ post: postId });
            }
            category.remove();
            req.flash(
                "successMessage",
                "All posts related to Category: " +
                    name +
                    " and comments on it are deleted"
            );
            return res.redirect("back");
        } else {
            return res.redirect("back");
        }
    } catch (err) {
        console.log("Error: ", err);
        return;
    }
};
