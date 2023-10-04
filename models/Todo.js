const {Schema, model} = require("../db/connection")

const TodoSchema = new Schema({
    firstname: {
        type: String, 
        required: true
    },
    
    lastname: {
        type: String
    },
    
    reminder: {
        type: String, 
        required: true
    },
    completed: {
        type: Boolean, 
        required: true, 
        default: false
    },
    
    email: {    
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    userId:{
        type: String,
        required: true
    }
})

const Todo = model("Todo", TodoSchema)

module.exports = Todo