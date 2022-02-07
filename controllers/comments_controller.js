const Comment = require("../models/comment");
const Like = require("../models/like");

const Post = require("../models/posts");

module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });
            post.comments.push(comment._id);
            post.save();
            req.flash("successMessage", "Comment Added");
            res.redirect("back");
        } else {
            return res.redirect("back");
        }
    } catch (err) {
        console.log("Error: ", err);
        return;
    }
};

module.exports.delete = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.commentId);
        if (comment.user == req.user.id || req.user.admin) {
            await Like.deleteMany({ likedOn: comment._id });
            let postId = comment.post;
            comment.remove();
            await Post.findByIdAndUpdate(postId, {
                pull: { comments: req.params.commentId },
            });
            req.flash("successMessage", " Comment Removed");

            return res.redirect("back");
        } else {
            return res.redirect("back");
        }
    } catch (err) {
        console.log("Error: ", err);
        return;
    }
};
