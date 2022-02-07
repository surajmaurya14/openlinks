const { populate } = require("../models/category");
const Category = require("../models/category");
const Post = require("../models/posts");

module.exports.errorLink = function (req, res) {
    return res.render("error", { title: "Invalid Page" });
};

module.exports.home = async function (req, res) {
    try {
        let post = await Post.find({ user: req.user._id })
            .populate("user")
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",
                options: { sort: { createdAt: 1 } },
                populate: {
                    path: "user",
                },
            });

        let categories = await Category.find({}).sort({ name: 1 });
        return res.render("home", {
            title: "Home",
            categories: categories,
            posts: post,
            pageCategory: "My Posts",
        });
    } catch (err) {
        console.log("Error: ", err);
        return;
    }
};
module.exports.about = function (req, res) {
    return res.render("about", {
        title: "About Us",
        developersList: ["Suraj Maurya"],
        messageSubject: [
            "Bug Report",
            "Feature Request",
            "Collaborate",
            "Discuss",
            "Ask for a Category",
        ],
        handles: [
            {
                link: "mailto:mailto:mauryasuraju@gmail.com",
                filePath: "/assets/images/Brands/envelope-solid.svg",
            },
            {
                link: "https://www.linkedin.com/in/mauryasuraj",
                filePath: "/assets/images/Brands/linkedin-brands.svg",
            },
            {
                link: "https://github.com/sumconsole",
                filePath: "/assets/images/Brands/github-brands.svg",
            },
            {
                link: "https://t.me/sumconsole",
                filePath: "/assets/images/Brands/telegram-brands.svg",
            },
        ],
    });
};
