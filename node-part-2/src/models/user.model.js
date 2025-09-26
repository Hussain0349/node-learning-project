import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required:true
  },
  email: {
    type:String,
    unique: true,
    required:true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type:String,
    required:true
  },
  firstName: {
    type: String,
    required:true
  },
  lastName: {
    type:String,
    required:true
  },
  role: {
    type: String,
    enum: ["user","admin","moderator"],
    default: "user"
  },
  preferences: {
    favoriteGenres: [String],
    readingGoals: { type: Number, default: 0 },
    privacy: { type: String, enum: ["public","private"], default: "public" },
    notifications: { type: Boolean, default: true }
  }
},{timestamps: true})

export default mongoose.model('User',userSchema);
