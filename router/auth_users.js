const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: '1h'});
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).json({
    message: 'User successfully logged in',
    accessToken: accessToken
  });
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!Array.isArray(books[isbn].reviews)) {
    books[isbn].reviews = []; 
  }

  books[isbn].reviews.push(review);
  res.json({
    message: 'Review added successfully',
    book: books[isbn]
  });
});

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    // Reset the reviews array
    books[isbn].reviews = [];
  
    res.json({
      message: 'Your review has been removed',
      book: books[isbn]
    });
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
