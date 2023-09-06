document.addEventListener("DOMContentLoaded", function () {
  // const addBooksForm = document.getElementById("addBooks");
  // const searchBooksForm = document.getElementById("searchBooks");
  // const readingBooksList = document.getElementById("readingBooks");
  // const finishedBooksList = document.getElementById("finishedBooks");

  const addBooksForm = document.getElementById("addBooks");
  const searchBooksForm = document.getElementById("searchBooks");
  const readingBooksList = document.getElementById("reading-books");
  const finishedBooksList = document.getElementById("completed-books");

  const books = [];
  const STORAGE_KEY = "BOOKSHELF";

  addBooksForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("input-title").value;
    const author = document.getElementById("input-author").value;
    const year = document.getElementById("input-year").value;
    const isComplete = document.getElementById("isComplete").checked;

    const book = {
      title,
      author,
      year,
      isComplete,
    };

    books.push(book);
    updateBookLists();
    saveData();
    addBooksForm.reset();
  });

  searchBooksForm.addEventListener("input", function (event) {
    event.preventDefault();
    const keySearch = document.getElementById("keySearch").value.toLowerCase();

    const filteredBooks = books.filter(function (book) {
      return book.title.toLowerCase().includes(keySearch);
    });

    updateBookLists(filteredBooks);
  });

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  function updateBookLists(filteredBooks = books) {
    readingBooksList.innerHTML = "";
    finishedBooksList.innerHTML = "";

    filteredBooks.forEach(function (book, index) {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book-item");
      bookItem.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
        `;

      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons");

      buttonsDiv.appendChild(createMoveButton(index));
      buttonsDiv.appendChild(createEditButton(index));
      buttonsDiv.appendChild(createDeleteButton(index));

      bookItem.appendChild(buttonsDiv);

      if (book.isComplete) {
        finishedBooksList.appendChild(bookItem);
      } else {
        readingBooksList.appendChild(bookItem);
      }
    });
  }

  function createEditButton(index) {
    const editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerHTML = `<i class="ri-edit-box-line"></i>`;
    editButton.addEventListener("click", function () {
      editBook(index);
    });
    return editButton;
  }

  function createDeleteButton(index) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = `<i class="ri-delete-bin-6-line"></i>`;
    deleteButton.addEventListener("click", function () {
      deleteBook(index);
    });
    return deleteButton;
  }

  function createMoveButton(index) {
    const moveButton = document.createElement("button");
    moveButton.classList.add("move-button");
    moveButton.innerHTML = books[index].isComplete
      ? `<i class="ri-book-open-line"></i>`
      : `<i class="ri-checkbox-circle-line"></i>`;
    moveButton.addEventListener("click", function () {
      toggleReadStatus(index);
    });
    return moveButton;
  }

  function editBook(index) {
    const book = books[index];
    const editModal = document.querySelector(".editModal");
    const editForm = document.getElementById("edit");
    const editTitleInput = document.getElementById("edit-title");
    const editAuthorInput = document.getElementById("edit-author");
    const editYearInput = document.getElementById("edit-year");

    editTitleInput.value = book.title;
    editAuthorInput.value = book.author;
    editYearInput.value = book.year;

    editModal.style.display = "block";

    editForm.addEventListener("submit", function (event) {
      event.preventDefault();

      book.title = editTitleInput.value;
      book.author = editAuthorInput.value;
      book.year = editYearInput.value;
      saveData();
      updateBookLists();
      editModal.style.display = "none";
    });
  }

  function deleteBook(index) {
    const deleteModal = document.querySelector(".deleteModal");
    const deleteForm = document.getElementById("delete");
    const deleteConfirm = document.createElement("div");
    deleteConfirm.innerHTML = `
    <p>Yakin ingin menghapus buku "${books[index].title}"?</p>
    <input type="hidden" name="id" value="">
    <div class="submit-btn">
        <button type="submit" value="Delete" name="Delete">Hapus Buku</button>
    </div>
    `;

    deleteModal.style.display = "block";

    deleteForm.addEventListener("submit", function (event) {
      event.preventDefault();

      books.splice(index, 1);
      saveData();
      updateBookLists();
      deleteModal.style.display = "none";
    });
    deleteForm.innerHTML = "";
    deleteForm.appendChild(deleteConfirm);
  }

  function loadData() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      books.push(...JSON.parse(storedData));
      updateBookLists();
    }
  }

  function toggleReadStatus(index) {
    books[index].isComplete = !books[index].isComplete;
    updateBookLists();
  }

  function saveData() {
    if (isStorageExist) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
    }
  }

  const closeButtons = document.querySelectorAll(".close");
  closeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelector(".editModal").style.display = "none";
      document.querySelector(".deleteModal").style.display = "none";
    });
  });
  
  loadData();
});
