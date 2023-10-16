const { Schema, model } = require("../db/connection");

const UserSchema = new Schema({

  username: {
    type: String,
    unique: true, // Ensure uniqueness for usernames
    required: true,
  },
  
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  contact_no: {
    type: Number,
    required: true,
  },
});

const User = model("User", UserSchema);

module.exports = User;
