import express from 'express'
import Book from '../models/book.model.js'
import User from '../models/user.model.js'
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


// aggregations pipeline
router.get('/aggregation', async (req, res) => {
  try {
   
    const booksPerUser = await Book.aggregate([
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { count: 1, 'user._id': 1, 'user.username': 1, 'user.email': 1 } }
    ]);


    const popularGenres = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);


    const usersWithMostBooks = booksPerUser.map(u => ({
      userId: u._id,
      username: u.user?.username || null,
      email: u.user?.email || null,
      count: u.count
    }));


    const newestBooks = await Book.find().sort({ createdAt: -1 }).limit(10).select('-__v');
    const newestUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('-password -__v');

    return res.status(200).json({
      booksPerUser,
      popularGenres,
      usersWithMostBooks,
      newestBooks,
      newestUsers
    });
  } catch (error) {
    console.error('Error fetching admin aggregations:', error.message);
    return res.status(500).json({ message: 'Error fetching aggregations', error: error.message });
  }
});

router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: "Something went wrong!" })
});



router.get('/stats', async (req, res) => {
  try {

    const totalBooks = await Book.countDocuments();

    const booksByGenre = await Book.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);


    const booksByYear = await Book.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: 1 } } 
    ]);


    const avgYearResult = await Book.aggregate([
      { $group: { _id: null, avgYear: { $avg: "$year" } } }
    ]);
    const avgYear = avgYearResult.length > 0 ? avgYearResult[0].avgYear : null;

    return res.status(200).json({
      totalBooks,
      booksByGenre,
      booksByYear,
      averagePublicationYear: avgYear
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


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

router.get('/user/:userId',async (req,res) =>{

    try {
        const{userId} = req.params
    
        if(!userId){
            return res.status(400).json('id is not given')
        }
    
        const books = await Book.find({userId})
    
        if(!books || books.length == 0){
            return res.status(404).json('This user has no books')
        }
        return res.status(200).json({
            data: books,
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }

})



// book with user info
router.get('/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'id is required' });

    const book = await Book.findById(id).populate('userId', '-password');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book details', error: error.message });
  }
});



export default router