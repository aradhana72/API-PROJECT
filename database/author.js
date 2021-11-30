const mongoose = require("mongoose");

//BOOK SCHEMA
const AuthorSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: [String]
});

//Creating Book Model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;
