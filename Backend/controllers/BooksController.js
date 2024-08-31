// controllers/BookController.js
const BookModel = require('../models/BooksModel');

class BookController {
    static async getFeaturedBooks(req, res) {
        try {
            const featuredBooks = await BookModel.getFeaturedBooks();
            res.json(featuredBooks);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    static async getCategories(req, res) {
    try {
        const categories = await BookModel.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).send('Error retrieving categories');
    }
}

static async deleteBook(req, res) {
    const {book_id} = req.body
    try {
        const book = await BookModel.deleteBook(book_id);  // Proceed to delete the book
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Failed to delete book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
}


static async deleteCategories(req, res) {
    const {category_id} = req.body;
    try {
        // Delete all books that belong to the category
        const books = await BookModel.getBooksByGenre(category_id);
        for (let book of books) {
            await BookModel.deleteBook(book.book_id);
        }
        // Then delete the category itself
        const delete_category = await BookModel.deleteCategory(category_id);
        // Delete the category
        if (!delete_category) throw new Error("Could not find category");
        
        res.status(200).json({message:"Successfully deleted Category and removed it from all Books"});
    } catch (err) {     
        console.log(err);
       res.status(400).json({message: "Failed to delete Category", error: err})
    }
    
}


static async updateBook(req, res) {
    const bookId = req.body.book_id;
    const bookData = {
        is_featured: req.body.is_featured,
        availability_status: req.body.availability,
        price: req.body.price
    };
    try {
        const success = await BookModel.updateBook(bookId, bookData);
        if (success) {
            res.status(200).json({ message: 'Book updated successfully' });
        } else {
            throw new Error('Failed to update book');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
}


static async updateCategory(req, res) {
    const {category_id, category_name} = req.body;
   
    
    try {
        const success = await BookModel.updateCategory(category_id, category_name);
        if (success) {
            res.status(200).json({ message: 'Book updated successfully' });
        } else {
            throw new Error('Failed to update book');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
}


    static async getNewArrivals(req, res) {
        try {
            const newArrivals = await BookModel.getNewArrivals();
            res.json(newArrivals);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getAllBooks(req, res) {
        try {
            const allBooks = await BookModel.getAllBooks();
            res.json(allBooks);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getAllITBooks(req, res) {
        try {
            const itBooks = await BookModel.getAllITBooks();
            res.json(itBooks);
        } catch (error) {
            console.error('Error retrieving IT books:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async getBookById(req, res) {
        try {
            const { bookId } = req.params;
            const book = await BookModel.getBookById(bookId);
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }
            res.json(book);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async createBook(req, res) {
        try {
            const bookData = req.body;
            const newBook = await BookModel.createBook(bookData);
            
            res.status(201).json(newBook);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // BookController.js
static async createCategory(req, res) {
    try {
        const categoryData = req.body;
        const newCategory = await BookModel.createCategory(categoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


  static async searchBooks(req, res) {

    try {
        const query = req.query.q;
        console.log('Search query:', query); // Add this line for debugging
        if (!query) {
            console.log('No search query provided'); // Add this line for debugging
            return res.status(400).json({ error: 'Search query is required' });
        }
        const searchResults = await BookModel.searchBooks(query);
        console.log('Search results:', searchResults); // Add this line for debugging
        res.json(searchResults);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'An error occurred while searching for books' });
    }
}

    static async getBooksByGenre(req, res) {
        try {
            const { genre } = req.params;
            let books;
    
            if (genre === 'all') {
                books = await BookModel.getAllBooks();
            } else {
                books = await BookModel.getBooksByGenre(genre);
            }
    
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    
    static async getNewArrivals(req, res) {
        try {
            const newArrivals = await BookModel.getNewArrivals();
            res.json(newArrivals);
        } catch (error) {
            console.error('Error retrieving new arrivals:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = BookController;