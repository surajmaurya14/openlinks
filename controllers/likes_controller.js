const User = require("../models/users");
const Post = require("../models/posts");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.likeStatus = async function (req, res) {
    try {
        let likedOn;
        let liked = false;

        if (req.query.name == "Post") {
            likedOn = await Post.findById(req.query.id).populate("likes");
        } else {
            likedOn = await Comment.findById(req.query.id).populate("likes");
        }

        let likeElement = await Like.findOne({
            likedOn: req.query.id,
            onModel: req.query.name,
            user: req.user._id,
        });
        if (likeElement) {
            likedOn.likes.pull(likeElement._id);
            likedOn.save();
            likeElement.remove();
            req.flash("normalMessage", " Like removed");
            return res.redirect("back");
        } else {
            let newLikeElement = await Like.create({
                user: req.user._id,
                likedOn: req.query.id,
                onModel: req.query.name,
            });
            likedOn.likes.push(newLikeElement._id);
            likedOn.save();
            liked = true;
            req.flash("normalMessage", " You liked the " + req.query.name);

            return res.redirect("back");
        }
    } catch (err) {
        if (err) {
            console.log("Error: ", err);
            return;
        }
    }
};
