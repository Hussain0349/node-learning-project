import express from 'express'
import dotenv from 'dotenv'
import reqLogger from './middleware/logger.js'
import apiRoutes from './route/api.js'
import webRoutes from './route/web.js'
import bookRoutes from './route/books.js'
// because my .env is in root and index.js is in the /src
dotenv.config({path:
  '../.env'
})
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(reqLogger)
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'NodeJS-Learning');
    next();
});

// routes
app.use('/api',apiRoutes)
app.use('/',webRoutes)
app.use('/api/books',bookRoutes)



const time = new Date().toISOString()
app.use((req,res,next) => {
    console.log(`${time} ${req.method} ${req.url}`)
    next()
}) 


app.get('/',(req,res) => {
    res.status(200).send('Welcome to the Express Server! ')
})



    



app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
});



app.listen(PORT,(req,res) => {
    console.log(`server is running on ${PORT}`)
})
