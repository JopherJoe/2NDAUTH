const {Schema, model} = require("../db/connection")

const mongoose = require('mongoose')

const changeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    previouscourse: {
        type: String,
        required: true,
    },
    newcourse: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
});

const ChangeCourse = model("ChangeCourse", changeSchema);
module.exports = ChangeCourse;
