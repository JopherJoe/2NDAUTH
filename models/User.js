const {Schema, model} = require("../db/connection")

const UserSchema = new Schema({
   
    password: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        require: true,
        
    },
    firstname: {
        type: String, 
        required: true
    },
    
    lastname: {
        type: String
    }

})

const User = model("User", UserSchema)

module.exports = User