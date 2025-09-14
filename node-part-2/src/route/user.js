import express from 'express'
const router = express.Router()
import User from '../models/user.model.js'
import bscrypt from 'bcrypt'
// all user

router.get('/',async(req,res) => {

    try {

        const users = await User.find().select('-password')

        if(!users){
            return res.status(500).json({
                message: 'something went wrong while fetching user'
            })
        }
        if(users.length == 0){
            return res.status(200).json(
                {
                    message: 'No user added yet '
                }
            )
        }

        return res.status(200).json({
            users
        })
        
    } catch (error) {
        console.log(`something went wronh while fetching users ${error.message}`)
    }
})


router.get('/:id',async (req,res) => {

    const{id} = req.params

    if(!id){
        return res.status(400,'id is required')
    }

    const user = await User.findById(id).select('-password')

    if(!user){
        return res.status(400,'user not found')
    }

    return res.status(200).json({
        user
    })
})

// new user 
router.post('/',async (req,res) => {

    try {
        const {username,password,email,lastName,firstName} = req.body
    
        if(!username || !password || !email || !lastName || !firstName){
    
            return res.status(400).json('all fields are required')
    
        }

        const endodedPassword = await bscrypt.hash(password,10)

        if(!endodedPassword){
            return res.status(500).json({
                message: 'something went wrong while hasing the password'
        })
        }
    
        const addedUser = await User.create({
            username,
            password,
            firstName,
            lastName,
            email
        })
        addedUser.save()
    
        if(!addedUser){
            return res.status(500).json('something went wrong while adding user')
        }
        return res.status(200).json(addedUser)
    } catch (error) {
        return res.status(500).json({ message: `Something went wrong while adding user: ${error.message}` })

    }
})

router.put('/:id',async(req,res) => {

    const{id} = req.params

    if(!id){
        res.status(400).json({
            message: 'id is required'
        })
    }

    const updateUser = await User.findByIdAndUpdate(id,req.body, {new:true}).select('-password')


    if(!updateUser){

         return res.status(500).json({
                messsage:'something went wrong while updating user'
            })

    }

    return res.status(200).json({
            message:'user updated sucessfully!',
            data: updateUser
        })
})

router.delete('/:id',async(req,res) => {

    try {
        const{id} = req.params
    
        if(!id){
            return res.status(400),json({
                message: 'id is required'
            })
        }
    
        const deleteUser = await User.findByIdAndDelete(id)
    
        if(!deleteUser){
            return res.status(500).json({
                messsage:'something went wrong while deleting user'
            })
        }
    
        return res.status(200).json({
            message:'user deleted sucessfully!'
        })
    } catch (error) {
        return res.status(500).json({
            messsage:'error caugh while deleting user',
            error: error.message
        })
    }
})
export default router