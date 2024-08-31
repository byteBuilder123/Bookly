
    static async createBook(req, res) {
        try {
            const bookData = req.body;
            const newBook = await BookModel.createBook(bookData);
            
            res.status(201).json(newBook);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

