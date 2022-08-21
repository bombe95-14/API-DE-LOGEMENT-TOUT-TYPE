
import { Schema as _Schema, model } from "mongoose";
//const uniqueValidator = require("mongoose-unique-validator");

const Schema = _Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  nom: String,
  telephone1: Number,
  telephone2: Number,
  adresse: String,
  image : String
});
//userSchema.plugin(uniqueValidator);
export default model("Agent", userSchema);
