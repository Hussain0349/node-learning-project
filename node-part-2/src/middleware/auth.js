import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const JWT_SECRET = process.env.JWT_TOKEN_SECRET;


const getTokenFromRequest = (req) => {
  let token = null;
  if (req.cookies?.token) {
    token = req.cookies.token;
  } 
  
  return token;
}


const requireAuth = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


const optionalAuth = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
  next();
};


const requireOwnership = (req, res, next) => {
  const { user } = req;
  const { ownerId } = req.resource 

  if (!user) return res.status(401).json({ error: "Not authenticated" });
  if (user.role === "admin") return next(); 
  if (user.id !== ownerId) {
    return res.status(403).json({ error: "You don’t own this resource" });
  }

  next();
};


const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export { requireAuth, optionalAuth, requireOwnership, requireAdmin };
