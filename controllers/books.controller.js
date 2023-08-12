const getBooks = require("./books/getBooks");
const getNewBooks = require("./books/getNewBooks");
const createNewBooks = require("./books/createNewBooks");
const getBookDetails = require("./books/getBookDetails");
const getUpdateBooks = require("./books/getUpdateBooks");
const updateBooks = require("./books/updateBook");
const deleteBook = require("./books/deleteBook");

module.exports = {
  getBooks,
  getNewBooks,
  createNewBooks,
  getBookDetails,
  getUpdateBooks,
  updateBooks,
  deleteBook,
};
