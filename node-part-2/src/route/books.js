import express from 'express'
const router = express.Router()
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        genre: "Fiction"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        genre: "Fiction"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        year: 1949,
        genre: "Dystopian"
    }
];

// generate new id for new added book
const generateNewId = (books) => {
    let id = 0
    if(books.length > 0){
        id = books.length + 1
        console.log(id)
        return id
    }
    else {
        console.log(id)
        return id
    }

}

router.get("/", (req,res) => {
    res.status(200).json(books)
})
router.get('/:id', (req,res) => {
    let id = parseInt(req.params.id)
    let book = books.find(b => b.id === id)
    if(!book){
        res.status(404).json({
            error: 'Book not found'
        })
    }
    res.status(200).json({
        book
    })
})

router.post("/", (req,res) => {
    let {title,author,year,genre} = req.body

    if(!title || !author || !year || !genre){
        res.status(400).json({
            message: 'title author or year missing'
        })
    }
    let newId = generateNewId(books)
    console.log(newId)

   let newBook = {
    id:newId,
    title,
    author,
    genre,
    year: parseInt(year)
   }
   books.push(newBook)
   res.status(200).json({
    message: 'book added successfully!',
    newBook
   })
})

router.put('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id))
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    const { title, author, year, genre } = req.body;
    

    if (!title || !author || !year) {
        return res.status(400).json({ error: 'Title, author, and year are required' })
    }
    
    books[bookIndex] = {
        id: parseInt(req.params.id),
        title,
        author,
        year: parseInt(year),
        genre: genre || ''
    };
    
    res.status(200).json(books[bookIndex])
});

router.delete('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    books.splice(bookIndex, 1);
    res.status(204).send();
});
export default router
