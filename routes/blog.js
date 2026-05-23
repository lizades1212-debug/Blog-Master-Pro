const express = require("express");
const Blog = require("../models/Blog");

const { ensureAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/create", ensureAuthenticated, (req, res) => {

    res.render("createBlog");

});

router.post("/create", ensureAuthenticated, async (req, res) => {

    try {

        const { title, content } = req.body;

        const newBlog = new Blog({
            title,
            content,
            author: req.user.id
        });

        await newBlog.save();

        req.flash("success_msg", "Blog Created Successfully");

res.redirect("/blogs");

    } catch (error) {

        console.log(error);

    }

});

router.get("/", async (req, res) => {

    try {

        const blogs = await Blog.find()
            .populate("author")
            .sort({ createdAt: -1 });

        res.render("blogs", {
    blogs,
    user: req.user
});

    } catch (error) {

        console.log(error);

    }

});

router.post("/delete/:id", ensureAuthenticated, async (req, res) => {

    try {

        const blog = await Blog.findById(req.params.id);

        // Ownership Check
        if (
            blog.author.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.send("Not Authorized");
        }

        // Admin can permanently delete
        if (req.user.role === "admin") {

            await Blog.findByIdAndDelete(req.params.id);

            req.flash("success_msg", "Blog deleted permanently");


            return res.redirect("/blogs");
        }

        // Normal user requests deletion
        await Blog.findByIdAndUpdate(req.params.id, {
            approveStatus: "delete-pending"
        });

        req.flash(
            "success_msg",
            "Delete request sent to admin"
        );


        res.redirect("/blogs");

    } catch (error) {

        console.log(error);

    }

});

router.post("/delete-approve/:id", ensureAuthenticated, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.send("Access Denied");
        }

        await Blog.findByIdAndDelete(req.params.id);

        req.flash("success_msg", "Blog deleted permanently");

        res.redirect("/blogs");

    } catch (error) {

        console.log(error);

    }

});



router.get("/edit/:id", ensureAuthenticated, async (req, res) => {

    try {

        const blog = await Blog.findById(req.params.id);

        // Ownership Check

        if (
             blog.author.toString() !== req.user.id &&
             req.user.role !== "admin"
        ) {
            return res.send("Not Authorized");
        }

        res.render("editBlog", { blog });

    } catch (error) {

        console.log(error);

    }

});

router.post("/edit/:id", ensureAuthenticated, async (req, res) => {

    try {

        const blog = await Blog.findById(req.params.id);

        // Ownership Check
        if (
            blog.author.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.send("Not Authorized");
        }
await Blog.updateOne(
    { _id: req.params.id },
    {
        $set: {
            title: req.body.title,
            content: req.body.content,
            approveStatus: "pending"
        }
    }
);

req.flash("success_msg", "Blog updated successfully");

res.redirect("/blogs");
    } catch (error) {

        console.log(error);

    }

});

router.post("/approve/:id", ensureAuthenticated, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.send("Access Denied");
        }

        await Blog.findByIdAndUpdate(req.params.id, {
            approveStatus: "approved"
        });

        req.flash("success_msg", "Blog approved successfully");


        res.redirect("/blogs");

    } catch (error) {

        console.log(error);

    }

});

router.post("/review/:id", ensureAuthenticated, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.send("Access Denied");
        }

        await Blog.findByIdAndUpdate(req.params.id, {
            approveStatus: "reviewed"
        });

        req.flash("success_msg", "Blog marked as reviewed");


        res.redirect("/blogs");

    } catch (error) {

        console.log(error);

    }

});

router.post("/reject/:id", ensureAuthenticated, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.send("Access Denied");
        }

        await Blog.findByIdAndUpdate(req.params.id, {
            approveStatus: "rejected"
        });

        req.flash("success_msg", "Blog rejected");


        res.redirect("/blogs");

    } catch (error) {

        console.log(error);

    }

});

module.exports = router;