const {Schema, model} = require("../db/connection")

const TodoSchema = new Schema({
    username: {
        type: String, 
        required: true},
    reminder: {
        type: String, 
        required: true
    },
    completed: {
        type: Boolean, 
        required: true, 
        default: false},
    email: {
        type: String,
        required: true,
    }
})

const Todo = model("Todo", TodoSchema)

module.exports = Todo