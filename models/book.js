// PACKAGE REQUIREMENTS
var mongoose = require("mongoose");

// MONGO DB BOOK SCHEMA CONFIG
var bookSchema = new mongoose.Schema({
    title:       String,
    author:      String,
    image:       String,
    description: String,
    
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
    },
    
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:  "Review"
        }
    ]
});

//EXPORT MONGO DB BOOK MODEL
module.exports = mongoose.model("Book", bookSchema);