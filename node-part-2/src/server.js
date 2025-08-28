import express from 'express'
import dotenv from 'dotenv'

// because my .env is in root and index.js is in the /src
dotenv.config({path:
  '../.env'
})

const app = express()

// in case .env variable is not loaded so 3000 will be our port
const PORT = process.env.PORT || 3000

const time = new Date().toISOString()

app.use((req,res,next) => {
    console.log(`${time} ${req.method} ${req.url}`)
    next()
}) 


app.get('/',(req,res) => {
    res.status(200).send('Welcome to the Express Server! ')
})


app.get('/api/status',(req,res) => {
    res.status(200).json({
        status: 'server is running',
        uptime: process.uptime
    })
})

app.get('/api/time', (req,res) => {
    res.status(200).json({
    currentTime: time
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
});



app.listen(PORT,(req,res) => {
    console.log(`server is running on ${PORT}`)
})