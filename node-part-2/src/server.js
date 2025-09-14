import express from 'express'
import dotenv from 'dotenv'
import reqLogger from './middleware/logger.js'
import apiRoutes from './route/api.js'
import webRoutes from './route/web.js'
import bookRoutes from './route/books.js'
import {dbConnect,dbDisconnect} from './config/database.js'

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

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



app.use((req, res, next) => {
    const time = new Date().toISOString(); 
    console.log(`${time} ${req.method} ${req.url}`);
    next();
});

app.get('/',(req,res) => {
    res.status(200).send('Welcome to the Express Server! ')
})



    



app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
});


dbConnect().then(() => {
  app.listen(PORT,(req,res) => {
    console.log(`server is running on ${PORT}`)
})
})

