/**
 * [
 *    {
 *      id: <string>
 *      title: <string>
 *      author: <string>
 *      year: <number>
 *      isComplete: <boolean>
 *    }
 * ]
 */

const books = [];

function generateId(){
    return +new Date();
}

function generateBooks(id, title, author, year, isComplete){
    return{
        id,
        title,
        author,
        year,
        isComplete
    };
}

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }