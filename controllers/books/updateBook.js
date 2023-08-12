const multer = require("multer");
const upload = multer().single("image");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function updateBooks(req, res, next) {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).send("Error uploading file");
    }

    const bookId = parseInt(req.params.id);
    const { title, summary, author, category, publisher, yop, language, formats, binding } =
      req.body;

    try {
      const existingBook = await prisma.books.findUnique({
        where: { id: bookId },
        include: {
          covers: true,
          bindings: true,
          book_authors: { include: { author: true } },
          book_categories: { include: { categorie: true } },
          publishers: true,
          languages: true,
          formats: true,
        },
      });

      const selectedAuthors = Array.isArray(author)
        ? author.map((authorId) => parseInt(authorId))
        : [parseInt(author)];
      const selectedCategories = Array.isArray(category)
        ? category.map((categoryId) => parseInt(categoryId))
        : [parseInt(category)];

      if (!existingBook) {
        return res.status(404).send("Book not found");
      }

      const authorId = parseInt(author) || existingBook.book_authors[0]?.authorId;
      const categoryId = parseInt(category) || existingBook.book_categories[0]?.cathegorieId;
      const publisherId = parseInt(publisher) || existingBook.publisherId;
      const languageId = parseInt(language) || existingBook.languageId;
      const formatId = parseInt(formats) || existingBook.formatId;
      const bindingId = parseInt(binding) || existingBook.bindingId;

      const updatedBookData = {
        title: title || existingBook.title,
        summary: summary || existingBook.summary,
        year: yop || existingBook.year,
        book_authors: {
          deleteMany: {
            bookId: bookId,
          },
          create: selectedAuthors.map((authorId) => ({
            author: {
              connect: {
                id: authorId,
              },
            },
          })),
        },
        book_categories: {
          deleteMany: {
            bookId: bookId,
          },
          create: selectedCategories.map((categoryId) => ({
            categorie: {
              connect: {
                id: categoryId,
              },
            },
          })),
        },
        publishers: { connect: { id: publisherId } },
        languages: { connect: { id: languageId } },
      };

      if (req.file) {
        const coverId = parseInt(req.file.filename) || existingBook.covers[0]?.id;
        updatedBookData.covers = { connect: { id: coverId } };
      }
      if (bindingId && bindingId !== 0) {
        const bindingExists = await prisma.bindings.findUnique({ where: { id: bindingId } });
        if (!bindingExists) {
          throw new Error(`Binding record with ID ${bindingId} does not exist.`);
        }
        updatedBookData.bindings = { connect: { id: bindingId } };
      }
      let isUpdated = false;
      for (const key in updatedBookData) {
        const newValue = updatedBookData[key];
        const oldValue = existingBook[key];
        if (newValue !== undefined && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          isUpdated = true;
          break;
        }
      }

      if (isUpdated) {
        const updatedBook = await prisma.books.update({
          where: { id: bookId },
          data: updatedBookData,
          include: {
            covers: true,
            bindings: true,
            book_authors: { include: { author: true } },
            book_categories: { include: { categorie: true } },
            publishers: true,
            languages: true,
            formats: true,
          },
        });
      }

      res.redirect(`/books`);
    } catch (error) {
      console.error("Error updating the book:", error);
      res.status(500).send("Error updating the book");
    }
  });
}
module.exports = updateBooks;
