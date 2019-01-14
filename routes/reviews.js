// REQUIRE EXPRESS
var express = require("express");

// EXPRESS ROUTER VARIABLE
var router = express.Router();

// MIDDLEWARE VARIABLE
var middleware = require("../middleware/middleware.js");

// MONGO DB MODEL & SCHEMA REQUIREMENTS
var Book    = require("../models/book.js"),
    Review = require("../models/review.js");

// REVIEW ROUTES, NESTED INSIDE SHOW ROUTE

// NEW REVIEW FORM ROUTE
router.get("/books/:id/reviews/new", middleware.isLoggedIn, function(req, res){
    //FIND BOOK WITH SPECIFIED ID
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            // PASS FOUND BOOK TO NEW.EJS & DISPLAY FORM PAGE
            res.render("reviews/new.ejs", {book: foundBook});
        }
    });
});

// CREATE REVIEW ROUTE
router.post("/books/:id/reviews", middleware.isLoggedIn, function(req, res){
    // FIND BOOK WITH SPECIFIED ID
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            // GET FORM DATA WITH BODY-PARSER & CREATE NEW REVIEW
            Review.create(req.body.review, function(err, newReview){
                if(err){
                    req.flash("errorMessage", "Something went wrong.");
                    res.redirect("/books");
                }else{
                    // GET USER ID & USERNAME, SAVE TO NEW REVIEW
                    newReview.user.id = req.user._id;
                    newReview.user.username = req.user.username;
                    newReview.save();
                    
                    // ADD NEW REVIEW TO FOUND BOOK'S REVIEW ARRAY, SAVE
                    foundBook.reviews.push(newReview);
                    foundBook.save();
                    
                    req.flash("successMessage", "Review successfully added.");
                    // DISPLAY FOUND BOOK'S PAGE
                    res.redirect("/books/" + foundBook._id);
                }
            });
        }
    });
});

// EDIT REVIEW ROUTE
router.get("/books/:id/reviews/:review_id/edit", middleware.isReviewOwner, function(req, res){
    // FIND REVIEW WITH SPECIFIED ID
    Review.findById(req.params.review_id, function(err, foundReview){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            // PASS FOUND REVIEW TO EDIT.EJS & DISPLAY PAGE
            res.render("reviews/edit.ejs", {book_id: req.params.id, review: foundReview});
        }
    });
});

// UPDATE REVIEW ROUTE
router.put("/books/:id/reviews/:review_id", middleware.isReviewOwner, function(req, res){
    // FIND REVIEW & UPDATE WITH INFO PULLED FROM EDIT FORM BY BODY-PARSER
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, updatedReview){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            req.flash("successMessage", "Review successfully updated.");
            res.redirect("/books/" + req.params.id);
        }
    });
});

// DELETE REVIEW ROUTE
router.delete("/books/:id/reviews/:review_id", middleware.isReviewOwner, function(req, res){
    // FIND REVIEW WITH SPECIFIED ID AND DELETE IT
    Review.findByIdAndRemove(req.params.review_id, function(err){
       if(err){
           req.flash("errorMessage", "Something went wrong.");
           res.redirect("/books");
       }else{
           req.flash("successMessage", "Review successfully deleted.");
           res.redirect("/books/" + req.params.id);
       }
    });
});

module.exports = router;