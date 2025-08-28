import express from 'express'
const webRoutes = express.Router()


webRoutes.get('/', (req,res) => {
      res.status(200).send('Welcome to the Express Server!');
})


export default webRoutes