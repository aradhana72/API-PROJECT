require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
//Database
const database = require("./database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

//Establish Database Connection
mongoose.connect(
  process.env.MONGO_URL
).then(()=> console.log("Connection Established!!!"));

//GET ALL BOOKS
/*
Route           /
Description     Get all books
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/", async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

//GET A SPECIFIC BOOK localhost:3000/12345Book
/*
Route           /is
Description     Get specific book
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn",async (req,res) => {
 const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

  if(!getSpecificBook) {
    return res.json({
      error: `No book found for ISBN of ${req.params.isbn}`
    });
  }

  return res.json(getSpecificBook);

});

//GET BOOKS on a specific category
/*
Route           /c
Description     Get specific book
Access          Public
Parameter       category
Methods         GET
*/

booky.get("/c/:category", async (req,res)=> {

const getSpecificBook = await BookModel.findOne({category: req.params.categry});
//If no specific book is returned the , the findne func returns null, and to execute the not
//found property we have to make the condn inside if true, !null is true.
if(!getSpecificBook) {
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
booky.get("/author",async (req, res)=> {
  const getAllAuthors = AuthorModel.find();
  return res.json(getAllAuthors);
});

//GET ALL AUTHORS BASED ON A BOOK
/*
Route           /author/book
Description     Get all authors based on book
Access          Public
Parameter       isbn
Methods         GET
*/

booky.get("/author/book/:isbn",async (req,res)=> {
  const getSpecificAuthor = await AuthorModel.findOne({books: req.params.isbn});

if(!getSpecificAuthor) {
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
  const getAllPublications = PublicationModel.find();
  return res.json(getAllPublications);
});

//ADD NEW BOOKS
/*
Route           /book/new
Description     add new books
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", async (req,res)=> {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook)
  return res.json({books: addNewBook, message: "Bok was added!"});
});

//ADD NEW AUTHORS
/*
Route           /author/new
Description     add new authors
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", async (req,res)=> {
  const { newAuthor } = req.body;
AuthorModel.create(newAuthor);
  return res.json({authors: database.authors, message: "Author was added"});
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

//Update a book title
/*
Route           /book/update/:isbn
Description     update title of the book
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/:isbn", async (req,res)=> {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({books: database.books});
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

booky.delete("/book/delete/:isbn", async (req,res)=> {
  const updateBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn
  });

  return res.json({books: updateBookDatabase});
});

//DELETE AN AUTHOR FROM A BOOK AND VICE VERSA
/*
Route           /book/delete/author
Description     delete an author from a book and vice versa
Access          Public
Parameter       isbn, authorId
Methods         DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", async (req,res)=> {
  //Update the book db
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
     $pull: {
       authors: parseInt(req.params.authorId)
     }
   },
   {
     new: true
   }
 );
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
