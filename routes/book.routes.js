const express = require("express");

const imageUploadMiddleware = require("../middlewares/image-upload");
const booksController = require("../controllers/books.controller");

const router = express.Router();

router.get("/books", booksController.getBooks);

router.get("/books/management", booksController.getNewBooks);

router.get("/books/details/:id", booksController.getBookDetails);

router.post("/book/new", imageUploadMiddleware, booksController.createNewBooks);

router.get("/book/manage/:id", booksController.getUpdateBooks);

router.post("/book/manage/:id", booksController.updateBooks);

router.delete("/book/manage/:id", booksController.deleteBook);

module.exports = router;
