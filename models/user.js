// PACKAGE REQUIREMENTS
var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

// MONGO DB COMMENT SCHEMA CONFIG
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: true}
});

// ASSOCIATE SCHEMA WITH PASSPORTLOCALMONGOOSE
userSchema.plugin(passportLocalMongoose);

//EXPORT MONGO DB BOOK MODEL
module.exports = mongoose.model("User", userSchema);