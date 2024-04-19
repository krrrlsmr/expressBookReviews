const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBookByIsbn = (isbn) => new Promise(resolve => {
  setTimeout(() => {
    const book = Object.values(books).find(b => b.isbn === isbn); 
    resolve(book || null);
  }, 1000); 
});


const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/books', async (req, res) => {

  try{
    const getBooks = () => new Promise(resolve => setTimeout(() => resolve(books), 1000));
    const booksData = await getBooks();
    res.json(booksData);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve books due to server error." });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByIsbn(isbn);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve book due to server error." });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    
    const booksByAuthor = Object.values(books).filter(b => b.author.toLowerCase() === author.toLowerCase());

    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
  
      res.status(404).json({ message: "No books found for this author." });
    }
  } catch (error) {

    res.status(500).json({ message: "Failed to retrieve books due to server error." });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const booksByTitle = Object.values(books).filter(b => b.title.toLowerCase().includes(title.toLowerCase()));

    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with that title." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve books due to server error." });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const bookKey = Object.keys(books).find(key =>books[key].isbn == isbn);
  if (bookKey) {
    const book = books[bookKey];
    if (book.review) {
      return res.json({ isbn, review: book.review });
    } else {
      return res.status(404).json({ message: "Review not found for this ISBN." });
    }
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;
