// OBJECT VARIABLE FOR EXPORT
var middleware = {};

// MONGO DB MODEL & SCHEMA REQUIREMENTS
var Book    = require("../models/book.js"),
    Review  = require("../models/review.js");

// LOGIN & BOOK OWNERSHIP CHECK
middleware.isBookOwner = function(req, res, next){
    // LOGIN CHECK
    if(req.isAuthenticated()){
        // FIND SPECIFIED BOOK
        Book.findById(req.params.id, function(err, foundBook){
            if(err || !foundBook){
                req.flash("errorMessage", "Something went wrong.");
                res.redirect("/books");
            }else{
                // OWNERSHIP CHECK - COMPARE BOOK CREATOR & CURRENT USER
                if(foundBook.user.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("errorMessage", "Cannot edit or delete books submitted by other users.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("errorMessage", "Please sign in.");
        res.redirect("/login");
    }
};

// LOGIN & REVIEW OWNERSHIP CHECK
middleware.isReviewOwner = function(req, res, next){
    // LOGIN CHECK
    if(req.isAuthenticated()){
        // FIND SPECIFIED REVIEW
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                req.flash("errorMessage", "Something went wrong.");
                res.redirect("/books");
            }else{
                // OWNERSHIP CHECK - COMPARE BOOK CREATOR & CURRENT USER
                if(foundReview.user.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("errorMessage", "Cannot edit or delete books submitted by other users.");
                    res.redirect("/books");
                }
            }
        });
    }else{
        req.flash("errorMessage", "Please sign in.");
        res.redirect("/books");
    }
};

// CHECK IF LOGGED IN
middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("errorMessage", "Please sign in.");
        res.redirect("/login");
    }
};

module.exports = middleware;