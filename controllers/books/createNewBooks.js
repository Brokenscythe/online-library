const multer = require("multer");
const upload = multer().single("image");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createNewBooks(req, res) {
  const { title, summary, author, category, publisher, yop, language, formats, binding } = req.body;
  const { filename } = req.file;

  try {
    const authorIds = author.map((a) => parseInt(a));
    const categoryIds = category.map((c) => parseInt(c));
    const publisherId = parseInt(publisher);
    const languageId = parseInt(language);
    const formatId = parseInt(formats);
    const bindingId = parseInt(binding);
    const newBook = await prisma.books.create({
      data: {
        title,
        summary,
        year: yop,
        bindings: { connect: { id: bindingId } },
        book_authors: {
          create: authorIds.map((authorId) => ({ author: { connect: { id: authorId } } })),
        },
        book_categories: {
          create: categoryIds.map((categoryId) => ({ categorie: { connect: { id: categoryId } } })),
        },
        publishers: { connect: { id: publisherId } },
        languages: { connect: { id: languageId } },
        formats: { connect: { id: formatId } },
        covers: { create: { url: req.file.filename } },
      },
      include: {
        covers: true,
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
      },
    });
    res.redirect("/books");
  } catch (error) {
    console.error("Error creating a new book:", error);
    res.status(500).send("Error creating a new book");
  }
}

module.exports = createNewBooks;
