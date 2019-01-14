// PACKAGE REQUIREMENTS
var express  = require("express"),
    passport = require("passport");
    
// EXPRESS ROUTER VARIABLE
var router = express.Router();

// MONGO DB MODEL & SCHEMA REQUIREMENTS
var User = require("../models/user.js");

// PASSPORT AUTHORIZATION ROUTES

// SHOW REGISTRATION FORM ROUTE
router.get("/register", function(req, res){
    res.render("register.ejs");
});

// CREATE NEW USER ROUTE
router.post("/register", function(req, res){
    // GET USERNAME FORM DATA WITH BODY-PARSER
    var newUser = new User({username: req.body.username});
    
    // GET PASSWORD FORM DATA WITH BODY-PARSER
    // REGISTER & LOG IN NEW USER, SHOW INDEX PAGE
    User.register(newUser, req.body.password, function(err, newlyCreatedUser){
        if(err){
            req.flash("errorMessage", err.message);
            return res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                req.flash("successMessage", "Account created. Welcome, " + newlyCreatedUser.username + ".");
                res.redirect("/books");
            });
        }
    });
});

// SHOW LOGIN FORM ROUTE
router.get("/login", function(req, res){
    res.render("login.ejs");
});

// LOGIN AUTHENTICATION ROUTE, USES PASSPORT MIDDLEWARE
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/books",
        failureRedirect: "/login"
    }), function(req, res){
        // EMPTY CALLBACK FUNCTION
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("successMessage", "Successfully signed out.");
    res.redirect("/books");
});

module.exports = router;