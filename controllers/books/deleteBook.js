const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function deleteBook(req, res, next) {
  const bookId = parseInt(req.params.id);
  try {
    const existingBook = await prisma.books.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!existingBook) {
      return res.status(404).send("Book not found");
    }

    await prisma.book_authors.deleteMany({
      where: {
        bookId,
      },
    });

    await prisma.book_categories.deleteMany({
      where: {
        bookId,
      },
    });

    await prisma.covers.deleteMany({
      where: {
        booksId: bookId,
      },
    });

    await prisma.books.delete({
      where: {
        id: bookId,
      },
    });
    res.redirect("/books");
  } catch (error) {
    console.error("Error deleting the book:", error);
    res.status(500).send("Error deleting the book");
  }
}

module.exports = deleteBook;
