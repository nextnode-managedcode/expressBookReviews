const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!authenticatedUser(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {

  let allBooks = {};
  const promise = new Promise((resolve, reject) => {

    let allBooks = JSON.stringify(books,null,4);
    resolve(allBooks);
  });

  promise.then((allBooks) => { res.send(allBooks); });       
 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {

  let isbn = req.params.isbn;

  resolve( books[isbn]);

  let bookMatchingIsbn = await getBooksByISBN(isbn);
  res.send(bookMatchingIsbn);

});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {

  let author = req.params.author;
  let authorBooks = [];

  const promise = new Promise((resolve, reject) => {     

       let isbn = 1;
   
       while (books[isbn]) {
         if (books[isbn].author == author) {
           let book = {"isbn": isbn, "author": books[isbn].author, "title": books[isbn].title, "reviews": books[isbn].reviews};
           authorBooks.push(book);
         }
         isbn++;
       }
       resolve(authorBooks);
      });

  promise.then((authorBooks) => { res.send(authorBooks); });       

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  let title = req.params.title;
  let titleBooks = [];

  const promise = new Promise((resolve, reject) => {

    let isbn = 1;

    while (books[isbn]) {
      if (books[isbn].title == title) {
        let book = {"isbn": isbn, "author": books[isbn].author, "title": books[isbn].title, "reviews": books[isbn].reviews};
        titleBooks.push(book);
      }
      isbn++;
    }

    resolve(titleBooks);
  });

  promise.then((titleBooks) => { res.send(titleBooks); });  

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  let isbn = req.params.isbn;
  let reviews = {};

  const promise = new Promise((resolve, reject) => {
  if (books[isbn]) {
    let reviews = books[isbn].reviews;
    resolve(reviews);
  }
});
  
  promise.then((reviews) => { res.send(reviews); });  

});

module.exports.general = public_users;
