
const mongoose = require("mongoose");
//const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
 
  nom: String,
  telephone1: Number,
  telephone2: Number,
  adresse: String,
  dateCreation : Date
});
//userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Client", userSchema);