// PACKAGE REQUIREMENTS
var mongoose = require("mongoose");

// MONGO DB COMMENT SCHEMA CONFIG
var reviewSchema = new mongoose.Schema({
    text: String,
    
    submitDate: {
        type: Date,
        default: Date.now
    },
    
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

//EXPORT MONGO DB BOOK MODEL
module.exports = mongoose.model("Review", reviewSchema);