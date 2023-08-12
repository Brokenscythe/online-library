const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const Book = require("../../models/book.model");

async function getNewBooks(req, res) {
  const book = new Book();
  const authors = await book.findAllAuthors();
  const categories = await book.findAllCategories();
  const publishers = await book.findAllPublishers();
  const languages = await book.findAllLanguages();
  const formats = await book.findAllFormats();
  const bindings = await book.findAllBindings();

  res.render("admin/new-books", {
    authors,
    categories,
    publishers,
    languages,
    formats,
    bindings,
  });
}

module.exports = getNewBooks;
