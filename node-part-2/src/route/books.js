import express from 'express'
import path from 'path'
import fs from 'fs'
const router = express.Router()

const booksFilePath = path.resolve("books.json")
let books = []


const loadBooks = () => {
    try {
        if (fs.existsSync(booksFilePath)) {
            const booksData = fs.readFileSync(booksFilePath, 'utf-8')
            books = JSON.parse(booksData)
            console.log("Books have been loaded successfully!")
        } else {

            fs.writeFileSync(booksFilePath, JSON.stringify([], null, 2));
            console.log("Created new books.json file")
        }
    } catch (error) {
        console.log(`Error caught while loading books: ${error.message}`)
        books = []
    }
};
loadBooks()


const saveBooks = () => {
    try {
        fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2))
        console.log("Books saved successfully!")
    } catch (error) {
        console.log(`Error saving books: ${error.message}`)
    }
}


const generateNewId = () => {
    if (books.length > 0) {
        return Math.max(...books.map(book => book.id)) + 1
    } else {
        return 1
    }
}


const validateBook = ({ title, author, year, genre }) => {
    const errors = []
    const currentYear = new Date().getFullYear()

    if (!title || typeof title !== "string" || title.trim() === "") {
        errors.push("Title must be a non-empty string")
    }
    if (!author || typeof author !== "string" || author.trim() === "") {
        errors.push("Author must be a non-empty string")
    }
    if (!year || isNaN(year) || year < 1000 || year > currentYear) {
        errors.push(`Year must be a number between 1000 and ${currentYear}`)
    }
    if (genre && (typeof genre !== "string" || genre.trim() === "")) {
        errors.push("Genre must be a string if provided")
    }

    return errors
};


router.get("/", (req, res) => {
    let { sort, order, page, limit } = req.query
    let result = [...books]

    if (sort) {
        result.sort((a, b) => {
            if (a[sort] < b[sort]) return order === "desc" ? 1 : -1
            if (a[sort] > b[sort]) return order === "desc" ? -1 : 1
            return 0;
        });
    }

    page = parseInt(page) || 1;
    limit = parseInt(limit) || result.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = result.slice(start, end)

    res.status(200).json({
        page,
        limit,
        total: result.length,
        data: paginated
    })
})

router.get("/search", (req, res) => {
    console.log("search", req.query)
    const { title, author } = req.query
    let result = books

    if (title) {
        result = result.filter(b => b.title.toLowerCase().includes(title.toLowerCase()))
    }
    if (author) {
        result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()))
    }

    if (result.length === 0) {
        return res.status(404).json({ error: "No matching books found" })
    }

    res.status(200).json(result)
});

router.get("/count", (req, res) => {
    res.status(200).json({ count: books.length })
});

router.post("/", (req, res, next) => {
    try {
        let { title, author, year, genre } = req.body;

        const errors = validateBook({ title, author, year, genre });
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        if (books.some(b => b.title.toLowerCase() === title.toLowerCase())) {
            return res.status(400).json({ error: "Book with this title already exists" })
        }

        let newId = generateNewId()
        let newBook = {
            id: newId,
            title,
            author,
            year: parseInt(year),
            genre: genre || ''
        };

        books.push(newBook);
        saveBooks()
        
        res.status(201).json({
            message: 'Book added successfully!',
            newBook
        });
    } catch (err) {
        next(err)
    }
});

router.get('/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let book = books.find(b => b.id === id)
    if (!book) {
        return res.status(404).json({ error: 'Book not found' })
    }
    res.status(200).json(book)
});

router.put('/:id', (req, res, next) => {
    try {
        const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id))
        if (bookIndex === -1) {
            return res.status(404).json({ error: 'Book not found' })
        }

        const { title, author, year, genre } = req.body;

        const errors = validateBook({ title, author, year, genre })
        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        books[bookIndex] = {
            id: parseInt(req.params.id),
            title,
            author,
            year: parseInt(year),
            genre: genre || ''
        };

        saveBooks(); 
        
        res.status(200).json(books[bookIndex]);
    } catch (err) {
        next(err)
    }
});

router.delete('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' })
    }

    books.splice(bookIndex, 1)
    saveBooks();
    
    res.status(204).send()
});

router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: "Something went wrong!" })
});

export default router