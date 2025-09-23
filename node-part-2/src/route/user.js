import express from 'express'
const router = express.Router()
import User from '../models/user.model.js'
import bcrypt from 'bcrypt'

// all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password')

    if (!users || users.length === 0) {
      return res.status(200).json({ message: 'No user added yet' })
    }

    return res.status(200).json(users) // return array directly
  } catch (error) {
    return res.status(500).json({ message: `Error fetching users: ${error.message}` })
  }
})

// single user by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'id is required' })
    }

    const user = await User.findById(id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'user not found' })
    }

    return res.status(200).json(user) // ✅ return user object directly
  } catch (error) {
    return res.status(500).json({ message: `Error fetching user: ${error.message}` })
  }
})

// create user
router.post('/', async (req, res) => {
  try {
    const { username, password, email, lastName, firstName } = req.body

    if (!username || !password || !email || !lastName || !firstName) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const addedUser = await User.create({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email
    })


    return res.status(201).json({
      _id: addedUser._id,
      username: addedUser.username,
      email: addedUser.email,
      firstName: addedUser.firstName,
      lastName: addedUser.lastName
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Something went wrong while adding user: ${error.message}` })
  }
})

// update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'id is required' })
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password')

    if (!updatedUser) {
      return res.status(404).json({ message: 'user not found' })
    }

    return res.status(200).json({ message: 'user updated successfully', data: updatedUser })
  } catch (error) {
    return res.status(500).json({ message: `Error updating user: ${error.message}` })
  }
})

// delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'id is required' })
    }

    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({ message: 'user not found' })
    }

    return res.status(200).json({ message: 'user deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: `Error deleting user: ${error.message}` })
  }
})

export default router
