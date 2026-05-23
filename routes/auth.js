const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/register", async (req, res) => {

    try {

        const { firstName, lastName, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            req.flash("error_msg", "Email already registered");

            return res.redirect("/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        req.flash("success_msg", "Registration successful. Please login.");

        res.redirect("/login");

    } catch (error) {

        console.log(error);

        req.flash("error_msg", "Something went wrong");

        res.redirect("/register");

    }

});

router.post(
    "/login",

    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: true
    })
);

router.get("/dashboard", ensureAuthenticated, (req, res) => {

    res.render("dashboard", {
        user: req.user
    });

});

router.get("/logout", (req, res, next) => {

    req.logout(function(error) {

        if (error) {
            return next(error);
        }

        res.redirect("/login");

    });

});

module.exports = router;