import express from 'express'
import dotenv from 'dotenv'
import reqLogger from "./middleware/reqLogger.js";  // ✅ not logger.js
import apiRoutes from './route/api.js'
import webRoutes from './route/web.js'
import userRoutes from './route/user.js'
import bookRoutes from './route/books.js'
import cors from "cors";
import {dbConnect,dbDisconnect} from './config/database.js'
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from './route/auth.js'
import cookieParser from 'cookie-parser'
import helmet from "helmet";

import rateLimit from "express-rate-limit";


// i have used the absolute path to load the .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 3000
const app = express()


app.use(helmet({
  contentSecurityPolicy: false, 
}))
app.use(cors({
  origin: process.env.PORT || "http://localhost:3000",
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});


app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser());
app.use(reqLogger)
app.use(cors());
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'NodeJS-Learning');
    next();
});

// rate limit
app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", generalLimiter);

// routes
app.use('/api/v1',apiRoutes)
app.use('/',webRoutes)
app.use('/api/v1/books',bookRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/auth',authRoutes)


app.use((req, res, next) => {
    const time = new Date().toISOString(); 
    console.log(`${time} ${req.method} ${req.url}`);
    next();
});

app.get('/',(req,res) => {
    res.status(200).send('Welcome to the Express Server! ')
})

app.get("/api/v1/health", (req,res)=>{
  res.status(200).json({ status:"ok", timestamp:new Date() });
});

app.get("/api/v1/config", (req,res)=>{
  res.status(200).json({
    apiVersion:"v1",
    features:["auth","books","users","recommendations"]
  });
});



app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
});


if (process.env.NODE_ENV !== "test") {
  dbConnect().then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  });
}

export default app;

