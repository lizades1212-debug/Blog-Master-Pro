const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const connectDB = require("./config/db");

const app = express();

// Passport Config
require("./config/passport")(passport);

// View Engine
app.set("view engine", "pug");

// Parse Form Data
app.use(express.urlencoded({ extended: false }));

// Sessions
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {

    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

    next();

});

// Connect Database
connectDB();

// Routes
app.use("/", require("./routes/auth"));
app.use("/blogs", require("./routes/blog"));

app.get("/", (req, res) => {
    res.send("Blog Master Pro Running");
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});