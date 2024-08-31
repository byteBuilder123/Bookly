//models//BooksModel.js
const pool = require('../db');

class BookModel {
    static async getAllBooks() {
        try {
            const query = 'SELECT * FROM books';
            const [rows, fields] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error retrieving books:', error);
            throw error;
        }
    }

    static async getCategories() {
    try {
        const query = 'SELECT * FROM category';
        const [results, fields] = await pool.query(query);
        return results;
    } catch (error) {
        console.error('Error retrieving categories:', error);
        throw error;
    }
}


    static async getAllITBooks() {
        try {
            const query = 'SELECT * FROM it_books';
            const [rows, fields] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error retrieving IT series books:', error);
            throw error;
        }
    }

    static async getFeaturedBooks() {
        try {
            const query = 'SELECT * FROM books WHERE is_featured = 1';
            const [results, fields] = await pool.query(query);
            console.log('Retrieved featured books:', results);
            return results;
        } catch (error) {
            console.error('Error retrieving featured books:', error);
            throw error;
        }
    }
   
    static async getBookById(bookId) {
        try {
            const query = 'SELECT * FROM books WHERE book_id = ?';
            const [results, fields] = await pool.query(query, [bookId]);
            // Check if there are results
            const book = results.length > 0 ? results[0] : null;
            return book;
        } catch (error) {
            console.error('Error retrieving book by ID:', error);
            throw error;
        }
    }

    static async createBook(bookData) {
        try {
            const { title, author, genre, description, price, published_date, availability_status, image_url, is_featured } = bookData;
            
            // Convert the date string to MySQL DATETIME format
            const formattedDate = new Date(published_date).toISOString().slice(0, 19).replace('T', ' ');

            const query = 'INSERT INTO books (title, author, genre, description, price, published_date, availability_status, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const [results, fields] = await pool.query(query, [title, author, genre, description, price, formattedDate, availability_status, image_url, is_featured]);
            // Get the ID of the newly created book
            const newBookId = results.insertId;
            return { book_id: newBookId, title, author, genre, description, price, published_date, availability_status, image_url, is_featured };
        } catch (error) {
            console.error('Error creating book:', error);
            throw error;
        }
    }
    
    // BookModel.js
static async createCategory(categoryData) {
    try {
        const { category_name } = categoryData;
        const query = 'INSERT INTO category (category_name) VALUES (?)';
        const [results, fields] = await pool.query(query, [category_name]);
        const newCategoryId = results.insertId;
        return { category_id: newCategoryId, category_name };
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}


        static async searchBooks(query) {
            
    try {
        const sqlQuery = `
            SELECT * FROM books
            WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?
        `;
        console.log('SQL Query:', sqlQuery); // Log the SQL query
        const [results, fields] = await pool.query(sqlQuery, [`%${query}%`, `%${query}%`, `%${query}%`]);
        return results;
    } catch (error) {
        console.error('Error searching books:', error);
        throw error;
    }
}

    static async getBooksByGenre(genre) {
        try {
            let query = 'SELECT * FROM books';
            let params = [];
    
            if (genre) {
                query += ' WHERE genre = ?';
                params.push(genre);
            }
    
            const [results, fields] = await pool.query(query, params);
            return results;
        } catch (error) {
            console.error('Error retrieving books by genre:', error);
            throw error;
        }
    }

     static async deleteBook(bookId) {
    try {
        const query = 'DELETE FROM books WHERE book_id = ?';
        const [results, fields] = await pool.query(query, [bookId]);
        return results.affectedRows > 0;  // Returns true if a row was deleted
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
} 
     static async deleteCategory(categoryId) {
    try {
        const query = 'DELETE FROM category WHERE category_id = ?';
        const [results, fields] = await pool.query(query, [categoryId]);
        return results.affectedRows > 0;  // Returns true if a row was deleted
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
} 

    
    static async getNewArrivals() {
        try {
            const query = 'SELECT * FROM books WHERE published_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH) ORDER BY published_date DESC LIMIT 10';
            const [results, fields] = await pool.query(query);
            return results;
        } catch (error) {
            console.error('Error retrieving new arrivals:', error);
            throw error;
        }
    }


        static async updateCategory(category_id, category_name) {
        try {
            const query = 'UPDATE category SET category_name = ? WHERE category_id = ?';
            const [results, fields] = await pool.query(query, [category_name, category_id]);
            return results.affectedRows > 0;  // Returns true if a row was updated
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }



static async updateBook(bookId, bookData) {
    try {
        const { is_featured, availability_status, price } = bookData;

        const query = 'UPDATE books SET price = ?, availability_status = ?, is_featured = ? WHERE book_id = ?';
        const [results, fields] = await pool.query(query, [price, availability_status, is_featured, bookId]);
        return results.affectedRows > 0;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
}


}


module.exports = BookModel;
