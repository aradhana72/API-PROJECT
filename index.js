const express = require("express");
var bodyParser = require("body-parser");
//Database
const database = require("./database");

//Initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

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

//ADD NEW BOOKS
/*
Route           /book/new
Description     add new books
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", (req,res)=> {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});

//ADD NEW AUTHORS
/*
Route           /author/new
Description     add new authors
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", (req,res)=> {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({updatedAuthors: database.author});
});

//ADD NEW AUTHORS
/*
Route           /publication/new
Description     add new publications
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/publication/new", (req,res)=> {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json({updatedPublications: database.publication});
});

//UPADTE PUB AND BOOK
/*
Route           /publication/update/book
Description     update the pub and the book
Access          Public
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", (req,res)=> {
  //UPDATE THE PUB DB
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //UPDATE THE BOOK DB
  database.books.forEach((book) => {
    if(book.ISBN == req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated!"
    }
  )

});

//DELETE A BOOK
/*
Route           /book/delete
Description     delete a book
Access          Public
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", (req,res)=> {
  const updateBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )

  database.books = updateBookDatabase;

  return res.json({books: database.books});
});

//DELETE AN AUTHOR FROM A BOOK AND VICE VERSA
/*
Route           /book/delete/author
Description     delete an author from a book and vice versa
Access          Public
Parameter       isbn, authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res)=> {
  //Update the book db
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });
  //Update author db
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) => book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });

  return res.json({
    book: database.books,
    author: database.author,
    message: "Author and book were deleted!!!"
  });

});

booky.listen(3000,() => console.log("Server is up and running!!!"));
