const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}

const db = require("./config/mongoose");
const app = express();

const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth-strategy");
const MongoStore = require("connect-mongo");
const messageFlasher = require("connect-flash");
const messageMiddleware = require("./config/messageMiddleware");

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static("./"));
app.use(expressLayouts);

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(
    session({
        name: "openlinks",
        secret: "fsnwibjsbi",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
        },
        store: MongoStore.create({
            mongoUrl: "*",
            autoremove: "disabled",
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(messageFlasher());
app.use(messageMiddleware.setMessage);

app.use("/", require("./routes/index.js"));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error when running the Server: ${err}`);
        return;
    }
    console.log(`Sever is Running on port: ${port}`);
});
