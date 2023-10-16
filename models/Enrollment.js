const {Schema, model} = require("../db/connection")

const enrollmentSchema = new Schema({
   
    course :{
        type: String,
        required: true,
        
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    contact_no:{
        type: String,
        required: true
    },
    guardian_contact: {
        type:String,
        required: true
    },
    age:{
        type: String,
        required:true
    },
    birthdate:{
        type:String,
        required: true
    },
    mothername:{
        type:String,
        required: true
    },
    fathername:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required: true
    },
    elementaryschool:{
        type: String,
        required: true
    },
    juniorschool:{
        type:String,
        required: true
    },
    seniorschool:{
        type:String,
        required: true
    },
    gender:{
        type:String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, // This field will store the user's ID
        ref: 'User', // Reference to the User model
        required: true,
        
    },
    enrolled:{
        type: Boolean,
        default: false
    }


})

const Enrollment = model("Enrollment", enrollmentSchema)

module.exports = Enrollment