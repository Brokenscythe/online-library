function isAuthorSelected(book, author) {
  return book.book_authors.some((ba) => ba.authorId === author.id);
}

function isCategorySelected(book, category) {
  return book.book_categories.some((bc) => bc.cathegorieId === category.id);
}

const deleteButton = document.getElementById("deleteButton");
const deleteForm = document.getElementById("deleteForm");

deleteButton.addEventListener("click", () => {
  const confirmDelete = confirm("Are you sure you want to delete this book?");
  if (confirmDelete) {
    const action = deleteForm.dataset.action;
    fetch(action, { method: "POST" })
      .then((response) => {
        if (response.ok) {
          window.location.href = "/books";
        } else {
          throw new Error("Error deleting the book");
        }
      })
      .catch((error) => {
        console.error("Error deleting the book:", error);
      });
  }
});
