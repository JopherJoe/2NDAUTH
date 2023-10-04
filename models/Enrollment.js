const {Schema, model} = require("../db/connection")

const enrollmentSchema = new Schema({
   
    course :{
        type: String,
        required: true
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    }


})

const Enrollment = model("Enrollment", enrollmentSchema)

module.exports = Enrollment