// services/BooksService.js

// Sample array to simulate a database
let books = [
    { id: 1, title: 'Book 1', author: 'Author 1' },
    { id: 2, title: 'Book 2', author: 'Author 2' },
    { id: 3, title: 'Book 3', author: 'Author 3' }
  ];
  
  class BooksService {
    static async getAllBooks() {
      // Simulate fetching all books from a database
      return books;
    }
  
    static async getBookById(bookId) {
      // Simulate fetching a book by ID from a database
      return books.find(book => book.id === bookId);
    }
  
    static async createBook(newBook) {
      // Generate a unique ID for the new book
      const newBookId = books.length > 0 ? books[books.length - 1].id + 1 : 1;
      const bookWithId = { id: newBookId, ...newBook };
      books.push(bookWithId);
      return bookWithId;
    }
  
    static async updateBook(bookId, updatedBookData) {
      const index = books.findIndex(book => book.id === bookId);
      if (index !== -1) {
        books[index] = { ...books[index], ...updatedBookData };
        return books[index];
      } else {
        return null; // Book not found
      }
    }
  
    static async deleteBook(bookId) {
      const index = books.findIndex(book => book.id === bookId);
      if (index !== -1) {
        const deletedBook = books.splice(index, 1);
        return deletedBook[0];
      } else {
        return null; // Book not found
      }
    }
  }
  
  module.exports = BooksService;
  