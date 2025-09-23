import mongoose from "mongoose";


const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
    },
    isbn: {
        type: String,
        unique: true,
        default: ''
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: 'user'
    }

},{timestamps:true})

export default mongoose.model('Book',bookSchema)