function isAuthorSelected(book, author) {
  return book.book_authors.some((ba) => ba.authorId === author.id);
}

function isCategorySelected(book, category) {
  return book.book_categories.some((bc) => bc.cathegorieId === category.id);
}

module.exports = { isAuthorSelected, isCategorySelected };
