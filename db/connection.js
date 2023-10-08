require("dotenv").config()
const mongoose = require("mongoose")
const { log } = require("mercedlogger")

const { DATABASE_URL } = process.env

// Corrected: Use mongoose.connect as a function call
mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true })

mongoose.connection
  .on("open", () => log.green("DATABASE STATE", "Connection Open"))
  .on("close", () => log.magenta("DATABASE STATE", "Connection Closed")) // Corrected: "Connection Closed" instead of "Connection Open"
  .on("error", (error) => log.red("DATABASE STATE", error))

module.exports = mongoose
