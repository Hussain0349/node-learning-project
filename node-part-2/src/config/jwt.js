import jwt from 'jsonwebtoken'
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const accessExpiry = process.env.ACCESS_EXPIRY
const regreshExpiry = process.env.REFRESH_EXPIRY
const generateAccessToken = (userName) => {

    return jwt.sign({userName},process.env.JWT_TOKEN_SECRET,{'expiresIn': accessExpiry})

}
const generateRefreshToken = (userName) => {

    return jwt.sign({userName},process.env.JWT_TOKEN_SECRET,{'expiresIn': regreshExpiry})

}

const verifyToken = (token) => {

    try {

        return jwt.verify(token,JWT_TOKEN_SECRET)
        
    } catch (error) {
        return 'token is not verified'
    }
}

export {generateAccessToken,generateRefreshToken,verifyToken}
