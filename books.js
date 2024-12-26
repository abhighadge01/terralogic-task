// routes/books.js
import express from "express"
const router = express.Router();
import Book from '../models/Book.js'

router.post('/books', async (req, res) => {
    try {
        const { title, author, year } = req.body;
        if (!title || !author || !year) {
            return res.status(400).json({ message: 'All fields (title, author, year) are required' });
        }
        if (title.length < 3) {
            return res.status(400).json({ message: 'Title must be at least 3 characters long' });
        }
        if (author.length < 3) {
            return res.status(400).json({ message: 'Author name must be at least 3 characters long' });
        }
        if (year < 1000 || year > new Date().getFullYear()) {
            return res.status(400).json({ message: 'Year must be a valid 4-digit number' });
        }

        const newBook = new Book({ title, author, year });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/books/:id', async (req, res) => {
    try {
        const { title, author, year } = req.body;
        if (title && title.length < 3) {
            return res.status(400).json({ message: 'Title must be at least 3 characters long' });
        }
        if (author && author.length < 3) {
            return res.status(400).json({ message: 'Author name must be at least 3 characters long' });
        }
        if (year && (year < 1000 || year > new Date().getFullYear())) {
            return res.status(400).json({ message: 'Year must be a valid 4-digit number' });
        }
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, year },
            { new: true, runValidators: true }
        );
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;


