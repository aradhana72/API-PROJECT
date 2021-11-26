const express = require("express");

//Database
const database = require("./database");

//Initialize express
const booky = express();

//GET ALL BOOKS
/*
Route           /
Description     Get all books
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/", (req,res) => {
  return res.json({books: database.books});
});

//GET A SPECIFIC BOOK localhost:3000/12345Book
/*
Route           /is
Description     Get specific book
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if(getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for ISBN of ${req.params.isbn}`
    });
  }

  return res.json({book: getSpecificBook});

});

//GET BOOKS on a specific category
/*
Route           /c
Description     Get specific book
Access          Public
Parameter       category
Methods         GET
*/

booky.get("/c/:category", (req,res)=> {
  const getSpecificBook = database.books.filter((book) =>
book.category.includes(req.params.category)
);

if(getSpecificBook.length === 0) {
  return res.json({
    error: `No book found for category of ${req.params.category}`
  });
}

return res.json({book: getSpecificBook});

});

//GET ALL AUTHORS
/*
Route           /author
Description     Get all authors
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/author", (req, res)=> {
  return res.json({authors: database.author});
});

//GET ALL AUTHORS BASED ON A BOOK
/*
Route           /author/book
Description     Get all authors based on book
Access          Public
Parameter       isbn
Methods         GET
*/

booky.get("/author/book/:isbn", (req,res)=> {
  const getSpecificAuthor = database.author.filter((author) =>
author.books.includes(req.params.isbn)
);

if(getSpecificAuthor.length === 0) {
  return res.json({
    error: `No author found for isbn of ${req.params.isbn}`
  });
}

return res.json({authors: getSpecificAuthor});
});

//GET ALL PUBLICATIONS
/*
Route           /publications
Description     Get all publications
Access          Public
Parameter       NONE
Methods         GET
*/

booky.get("/publications", (req,res) => {
  return res.json({publications: database.publication});
});

booky.listen(3000,() => console.log("Server is up and running!!!"));
