import express from 'express'
import Book from '../models/book.model.js'
import bookModel from '../models/book.model.js'

const router = express.Router()


// all the book
router.get('/',async (req,res) => {

    try {

        const books = await Book.find()

        if(books.length == 0){
           return res.status(200).json({
                message: 'no book added yet'
            })
        }
        return res.status(200).json(books)
        
    } catch (error) {
        console.log(`Error while fetching the books: ${error.message}`)
    }

})

// return a book based on id
router.get('/:id',async (req,res) => {

    const {id} = req.params
    
    if(!id){
        return res.status(400).json({
            message: 'Id is required'
        })
    }

    const book = await Book.findById(id)

    if(!book){
        return res.status(404,'Book not found')
    }
    return res.status(200).json({
        book
    })
})

// new added book
router.post('/',async(req,res) => {
    try {

        const {title,author,year,genre,isbn,userId} = req.body
        console.log(title,author,genre)
        if(!title || !author ||  !year || !genre || !isbn ){
           return  res.status(400).json({
                message: 'All data is required'
            })
        }

        const addedBook = await Book.create({
            title,
            author,
            year,
            isbn,
            userId
        })
        addedBook.save()
        if(!addedBook){
            return res.status(500).json({message: 'something went wrong while adding book'})
        }
        return res.status(200,).json(addedBook)
        
    } catch (error) {
        console.log(`Books not added due to some error: ${error.message}`)
    }
})

// update route
router.put('/:id',async(req,res) => {
    try {

        const {id} = req.params
        if(!id){
            return res.status(400).json({
                message: 'Id is required'
            })
        }
       const updatedInfo = await Book.findByIdAndUpdate(id,req.body,{new:true})
       
       if(!updatedInfo){
        return res.status(500).json({
            message: 'something wnet wrong while updaing book'
        })
       }
       
       return res.status(200).json({
        data: updatedInfo,
        message: 'Book updated sucessfully'
       })


    } catch (error) {
        console.log(`error caught while updating book ${error.message}`)
    }
})

// delete a book 

router.delete('/:id',async (req,res) => {

    try {
        const {id} = req.params
        if(!id){
            return res.status(400).json({
                message: 'id is required'
            })
        }
    
        const deletedOne = await Book.findByIdAndDelete(id,{new:true})
    
        if(!deletedOne){
            return res.status(500,'error caught while deleting book')
        }
    
        return res.status(200).json({
            message: 'book delete sucessfully!'
        })
    } catch (error) {

        console.log(`something went wrong while deleting the book ${error.message}`)
        
    }
})

router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: "Something went wrong!" })
});

export default router