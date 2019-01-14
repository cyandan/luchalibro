// REQUIRE EXPRESS
var express = require("express");

// EXPRESS ROUTER VARIABLE
var router = express.Router();

// MIDDLEWARE VARIABLE
var middleware = require("../middleware/middleware.js");

// MONGO DB MODEL & SCHEMA REQUIREMENTS
var Book = require("../models/book.js");

// INDEX ROUTE -- SHOW ALL BOOKS PAGE
router.get("/books", function(req, res){
    // CHECK FOR SEARCH QUERY
    if(req.query.search){
        
        // RUN SEARCH QUERY THROUGH ESCAPE FUNCTION
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        // FIND ALL BOOKS IN DB MATCHING SEARCH QUERY
        Book.find({title: regex}, function(err, matchBooks){
            if(err){
                req.flash("errorMessage", "Something went wrong.");
                res.redirect("/");
            }else{
                // IF MATCHES FOUND
                if(matchBooks.length > 0) {
                    // PASS ALL MATCHING BOOKS TO INDEX.EJS & DISPLAY PAGE
                    res.render("books/index.ejs", {books: matchBooks});
                }else{
                    req.flash("errorMessage", "No matches found.");
                    res.redirect("/books");
                }
            }
        });
        
    }else{
        // FIND ALL BOOKS
        Book.find({}, function(err, allBooks){
            if(err){
                req.flash("errorMessage", "Something went wrong.");
                res.redirect("/");
            }else{
                // PASS ALL FOUND BOOKS TO INDEX.EJS & DISPLAY PAGE
                res.render("books/index.ejs", {books: allBooks});
            }
        });
    }
});

// NEW ROUTE -- NEW BOOK FORM PAGE
router.get("/books/new", middleware.isLoggedIn, function(req, res){
    res.render("books/new.ejs");
});

// CREATE ROUTE -- ADD NEW BOOK TO DB
router.post("/books", middleware.isLoggedIn, function(req, res){
    // GET FORM DATA USING BODY-PARSER & EXPRESS SANITIZER
    var title       = req.sanitize(req.body.title),
        author      = req.sanitize(req.body.author),
        image       = req.sanitize(req.body.image),
        description = req.sanitize(req.body.description);
        
    // GET USERNAME & ID
    var user = {
        id: req.user._id,
        username: req.user.username
    };
        
    // CREATE NEW OBJ WITH FORM DATA & USER INFO
    var newBook = {
        title: title, 
        author: author, 
        image: image, 
        description: description,
        user: user
    };
    
    // ADD NEW BOOK TO DB & SHOW BOOKS PAGE
    Book.create(newBook, function(err, newlyCreatedBook){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            req.flash("successMessage", "Book successfully added.");
            res.redirect("/books");
        }
    });
});

// SHOW ROUTE -- SHOW BOOK REVIEWS PAGE
router.get("/books/:id", function(req, res){
    // FIND BOOK WITH SPECIFIED ID
    // POPULATE FOUND BOOK'S REVIEWS ARRAY
    Book.findById(req.params.id).populate("reviews").exec(function(err, foundBook){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            // PASS FOUND BOOK TO SHOW.EJS & DISPLAY PAGE 
            res.render("books/show.ejs", {book: foundBook});
        }
    });
});

// EDIT BOOK ROUTE -- SHOW EDIT FORM
router.get("/books/:id/edit", middleware.isBookOwner, function(req, res){
    // FIND BOOK WITH SPECIFIED ID
    Book.findById(req.params.id, function(err, foundBook){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            // PASS FOUND BOOK TO EDIT.EJS & DISPLAY PAGE
            res.render("books/edit.ejs", {book: foundBook});
        }
    });
});

// UPDATE BOOK ROUTE
router.put("/books/:id", middleware.isBookOwner, function(req, res){
    // FIND BOOK & UPDATE WITH INFO PULLED FROM EDIT FORM BY BODY-PARSER
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            req.flash("successMessage", "Book successfully updated.");
            res.redirect("/books/" + req.params.id);
        }
    });
});

// DELETE BOOK ROUTE
router.delete("/books/:id", middleware.isBookOwner, function(req, res){
    // FIND BOOK WITH SPECIFIED ID AND DELETE IT
    Book.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("errorMessage", "Something went wrong.");
            res.redirect("/books");
        }else{
            req.flash("successMessage", "Book successfully deleted.");
            res.redirect("/books");
        }
    });
});

// FUNCTION TO SANITIZE SEARCH STRING
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;