const path = require("path");
const passport = require("passport");
const express = require("express");
const cookieSession = require("cookie-session");

require("./auth");

function isLoggedIn(req, res, next) {
    console.log(req);
    req.user ? next() : res.redirect("/");
}

const app = express();

app.use(
    cookieSession({
        name: "google-auth-session",
        keys: ["key1"],
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "src"));
});

app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/secure",
        failureRedirect: "/auth/failure",
        session: true,
    })
);

app.get("/auth/failure", (req, res) => {
    res.send("failed");
});

app.get("/secure", isLoggedIn, (req, res) => {
    res.send("secure");
});

app.get("/logout", (req, res) => {
    res.session = null;
    req.logout();
    res.redirect("/");
});

module.exports = app;
