// PACKAGE REQUIREMENTS
var express          = require("express"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride   = require("method-override"),
    flash            = require("connect-flash"),
    expressSanitizer = require("express-sanitizer");
    
// MONGO DB MODEL & SCHEMA REQUIREMENTS
var User = require("./models/user.js");
    
// ROUTE FILE REQUIREMENTS
var bookRoutes     = require("./routes/books.js"),
    reviewRoutes   = require("./routes/reviews.js"),
    indexRoutes    = require("./routes/index.js");

// APP VARIABLE
var app = express();

// CONNECT TO MONGO DB
mongoose.connect(process.env.DATABASEURL);

// VARIOUS APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));  // FOR LINKING CSS DOC
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
app.use(expressSanitizer());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Super top secret secrety things!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// SETS LOCAL VARIABLES ACCESSED WITHIN TEMPLATE PAGES
app.use(function(req, res, next){
    // CURRENTLY LOGGED IN USER
    res.locals.currentUser = req.user;
    // CONNECT FLASH MESSAGES
    res.locals.errorMessage = req.flash("errorMessage");
    res.locals.successMessage = req.flash("successMessage");
    next();
});

// APP ROUTE CONFIG
app.use(bookRoutes);
app.use(reviewRoutes);
app.use(indexRoutes);

// ROOT PAGE ROUTE -- SHOW LANDING PAGE
app.get("/", function(req, res){
    res.render("landing.ejs");
});

// REQUEST LISTENER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Lucha Libro Server Started");
});