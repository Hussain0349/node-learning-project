import { body } from "express-validator";


export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username must be 3-20 chars, alphanumeric + underscore only"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .matches(/[A-Z]/).withMessage("Must contain uppercase")
    .matches(/[a-z]/).withMessage("Must contain lowercase")
    .matches(/[0-9]/).withMessage("Must contain number"),
  body("firstName").isLength({ min: 2, max: 50 }).isAlpha(),
  body("lastName").isLength({ min: 2, max: 50 }).isAlpha(),
];


export const validateBook = [
  body("title").trim().isLength({ min: 1, max: 200 }),
  body("author").trim().isLength({ min: 1, max: 100 }),
  body("year").isInt({ min: 1000, max: new Date().getFullYear() + 1 }),
  body("genre").optional().isString(),
  body("isbn").optional().matches(/^(?:\d{9}[\dX]|\d{13})$/),
];
