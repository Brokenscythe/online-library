const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getBooks(req, res) {
  try {
    const books = await prisma.books.findMany({
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

    const bookAuthors = await prisma.book_authors.findMany({
      include: {
        author: true,
      },
    });
    const bookCategories = await prisma.book_categories.findMany({
      include: {
        categorie: true,
      },
    });
    const bindings = await prisma.bindings.findMany();
    const formats = await prisma.formats.findMany();
    const languages = await prisma.languages.findMany();
    const publishers = await prisma.publishers.findMany();

    res.render("admin/list-of-books", {
      books,
      bookAuthors,
      bookCategories,
      bindings,
      formats,
      languages,
      publishers,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Error fetching books");
  }
}

module.exports = getBooks;
