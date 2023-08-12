const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const helpers = require("../../views/admin/helpers");

async function getUpdateBooks(req, res, next) {
  const bookId = parseInt(req.params.id);

  if (isNaN(bookId)) {
    console.log("Invalid book ID:", req.params.id);
    return res.status(400).send("Invalid book ID");
  }

  try {
    const book = await prisma.books.findUnique({
      where: { id: bookId },
      include: {
        bindings: true,
        book_authors: {
          include: {
            author: true,
          },
        },
        book_categories: {
          include: {
            categorie: true,
          },
        },
        publishers: true,
        languages: true,
        formats: true,
        covers: true,
      },
    });

    if (!book) {
      return res.status(404).send("Book not found");
    }

    const authors = await prisma.authors.findMany();
    const categories = await prisma.categories.findMany();
    const publishers = await prisma.publishers.findMany();
    const languages = await prisma.languages.findMany();
    const formats = await prisma.formats.findMany();
    const bindings = await prisma.bindings.findMany();

    res.render("admin/update-book", {
      book,
      authors,
      categories,
      publishers,
      languages,
      formats,
      bindings,
      isAuthorSelected: helpers.isAuthorSelected,
      isCategorySelected: helpers.isCategorySelected,
    });
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).send("Error fetching book details");
  }
}

module.exports = getUpdateBooks;
