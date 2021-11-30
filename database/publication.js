const mongoose = require("mongoose");

//BOOK SCHEMA
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: String,
  books: [String]
});

//Creating Book Model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;
