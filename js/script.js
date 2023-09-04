const books = [];
const RENDER_EVENT = "render-bookshelf";
const SAVED_EVENT = "saved-bookshelf";
const STORAGE_KEY = "BOOKSHELF";

function generateId() {
  return +new Date();
}

function generateBooks(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of todos) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
function saveData() {
  if (isStorageExist) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
  document.dispatchEvent(new Event(SAVED_EVENT));
}

function loadData() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    books.push(...JSON.parse(storedData));
    displayBooks();
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function displayBooks(filterBooks) {
  const readingBooksContainer = document.getElementById("readingBooks");
  const finishedBooksContainer = document.getElementById("finishedBooks");

  readingBooksContainer.innerHTML = "";
  finishedBooksContainer.innerHTML = "";

  if (filterBooks) {
    filterBooks.forEach((book) => {
      const bookItem = makeBooks(book);
      if (book.isCompleted) {
        finishedBooksContainer.appendChild(bookItem);
      } else {
        readingBooksContainer.appendChild(bookItem);
      }
    });
  } else {
    books.forEach((book) => {
      const bookItem = makeBooks(book);
      if (book.isCompleted) {
        finishedBooksContainer.appendChild(bookItem);
      } else {
        readingBooksContainer.appendChild(bookItem);
      }
    });
  }
}

function makeBooks(bookObject) {
  const { id, title, author, year, isCompleted } = bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const textYear = document.createElement("p");
  textYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("booklists");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      unCompleted(id);
    });

    container.append(undoButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addCompleted(id);
    });

    container.append(checkButton);
  }

  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", function () {
    editBooks(id);
  });

  const trashButton = document.createElement("button");
  trashButton.classList.add("trash-button");
  trashButton.addEventListener("click", function () {
    remove(id);
  });

  container.append(editButton, trashButton);

  return container;
}

function addBooks() {
  const title = document.getElementById("input-title").value;
  const author = document.getElementById("input-author").value;
  const year = document.getElementById("input-year").value;

  const id = generateId();
  const bookObject = generateBooks(id, title, author, year, false);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addCompleted(bookId) {
  const target = findBook(bookId);

  if (target == null) return;

  target.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function remove(bookId) {
  const target = findIndex(bookId);

  if (target === -1) return;

  books.splice(target, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function unCompleted(bookId) {
  const target = findBook(bookId);
  if (target == null) return;

  target.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function search(title) {
  const searchText = title.toLowerCase().trim();

  const searchResults = books.filter((book) => {
    book.title.toLowerCase().includes(searchText);
  });

  return searchResults;
}

function editModal(bookId) {
  const edit = document.querySelector(".editModal");
  const editForm = edit.querySelector("#edit");
  const title = editForm.querySelector("#edit-title");
  const author = editForm.querySelector("#edit-author");
  const year = editForm.querySelector("#edit-year");

  const bookEdit = findBook(bookId);

  if (bookEdit) {
    title.value = bookEdit(title);
    author.value = bookEdit(author);
    year.value = bookEdit(year);

    edit.style.display = "block";

    editForm.addEventListener("submit", function (event) {
      event.preventDefault();
      bookEdit.title = title.value;
      bookEdit.author = author.value;
      bookEdit.year = year.value;

      saveData();
      displaySearchResults([]);
      edit.style.display = "none";
    });
    window.addEventListener("click", function (event) {
      if (event.target === edit) {
        edit.style.display = "none";
      }
    });
  }
}

function deleteModal(bookId) {
  const delModal = document.querySelector(".deleteModal");
  const delForm = delModal.querySelector("form");
  const delButton = delForm.querySelector("button");

  delButton.addEventListener("click", function (event) {
    event.preventDefault();
    remove(bookId);
    delModal.style.display = "none";
    displaySearchResults([]);
  });

  delModal.style.display = "block";

  window.addEventListener("click", function (event) {
    if (event.target === delModal) {
      delModal.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.getElementById("addBooks");
  const searchInput = document.getElementById("keySearch");

  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
  });

  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.trim(); // Get the current search input value
    const searchResults = search(searchText);

    displayBooks(searchResults);
  });

  if (isStorageExist()) {
    loadData();
  }
});
