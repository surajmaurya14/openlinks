const Category = require("../models/category");
const Post = require("../models/posts");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async function (req, res) {
    try {
        let categoryId;
        let category = await Category.findOne({ name: req.body.categoryName });
        categoryId = category.id;

        await Post.create({
            content: req.body.postedString,
            user: req.user._id,
            category: categoryId,
        });
        req.flash("successMessage", " New Post Added");
        return res.redirect("back");
    } catch (err) {
        console.log("Error: ", err);
        return;
    }
};

module.exports.delete = async function (req, res) {
    try {
        let post = await Post.findById(req.params.postId);
        if (post.user == req.user.id || req.user.admin) {
            await Like.deleteMany({ likedOn: post });
            post.remove();

            for (let i of post.comments) {
                await Like.deleteMany({ likedOn: i._id });
            }
            await Comment.deleteMany({ post: post._id });
            req.flash(
                "successMessage",
                " Post and all comments associated with it are removed"
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
