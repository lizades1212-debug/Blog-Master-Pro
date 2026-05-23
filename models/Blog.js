const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    approveStatus: {
        type: String,
        enum: ["pending", "reviewed", "approved", "rejected","delete-pending"],
        default: "pending"
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Blog", BlogSchema);