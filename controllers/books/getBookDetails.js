const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getBookDetails(req, res, next) {
  const bookId = parseInt(req.params.id);
  try {
    const book = await prisma.books.findUnique({
      where: { id: bookId },
      include: {
        publishers: true,
      },
    });

    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render("admin/book-details", {
      book,
    });
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).send("Error fetching book details");
  }
}

module.exports = getBookDetails;
