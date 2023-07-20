const multer = require("multer");
const upload = multer().single("image");
const { PrismaClient } = require("@prisma/client");

const helpers = require("../views/admin/helpers");

const prisma = new PrismaClient();
const Book = require("../models/book.model");

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

module.exports = {
  getBooks: getBooks,
  getNewBooks: getNewBooks,
  createNewBooks: createNewBooks,
  getBookDetails: getBookDetails,
  getUpdateBooks: getUpdateBooks,
  updateBooks: updateBooks,
  deleteBook: deleteBook,
};
