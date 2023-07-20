const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class Book {
  constructor() {}

  async findAllBindings() {
    const bindings = await prisma.bindings.findMany();
    return bindings;
  }

  async findAllAuthors() {
    const authors = await prisma.authors.findMany();
    return authors;
  }

  async findAllCategories() {
    const categories = await prisma.categories.findMany();
    return categories;
  }

  async findAllPublishers() {
    const publishers = await prisma.publishers.findMany();
    return publishers;
  }

  async findAllLanguages() {
    const languages = await prisma.languages.findMany();
    return languages;
  }

  async findAllFormats() {
    const formats = await prisma.formats.findMany();
    return formats;
  }
}

module.exports = Book;
