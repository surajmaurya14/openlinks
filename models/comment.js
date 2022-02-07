const mongoose = require("mongoose");
const commentsSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Like",
            },
        ],
    },
    { timestamps: true }
);
const Comment = mongoose.model("Comment", commentsSchema);
module.exports = Comment;
