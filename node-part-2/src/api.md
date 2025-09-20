# Base URL
```
http://localhost:3000/
```

# user model schema

| Field       | Type     | Required | Description                 |
| ----------- | -------- | -------- | --------------------------- |
| `_id`       | ObjectId | Yes      | Unique identifier           |
| `username`  | String   | Yes      | Unique username             |
| `email`     | String   | Yes      | Unique email address        |
| `password`  | String   | Yes      | Hashed password             |
| `firstName` | String   | Yes      | User’s first name           |
| `lastName`  | String   | Yes      | User’s last name            |
| `createdAt` | Date     | Auto     | Timestamp when user created |
| `updatedAt` | Date     | Auto     | Timestamp when user updated |


# book model schema


| Field       | Type     | Required | Description                           |
| ----------- | -------- | -------- | ------------------------------------- |
| `_id`       | ObjectId | Yes      | Unique identifier                     |
| `title`     | String   | Yes      | Title of the book                     |
| `author`    | String   | Yes      | Author name                           |
| `year`      | Number   | No       | Year of publication                   |
| `genre`     | String   | No       | Genre of the book                     |
| `userId`    | ObjectId | Yes      | Reference to User (`User._id`)        |
| `createdAt` | Date     | Auto     | Timestamp when book was created       |
| `updatedAt` | Date     | Auto     | Timestamp when book was last modified |

#  relationship between book and user 

```
One-to-Many:

A User can have many Books.

Relation: Book.userId → User._id
```


# books api endpoints

```
get: / (that server is running or not)
get: /books (All availible books)
get: /search (search for a book either on author or title)
get: /count (return totall number of books)
post: /books (To add new book)
put: /:id (To update some book)
delete: /:id (To delete a book)
get: /state (get a state of a books)
get: /book.user/user:id (specific user books)
```

## user api routes

```
post: /users (create user)
get: /users (all user)
get: /users/:id (only one user)
put: /user/:id (update the user)
delete: /user/:id (delete the user)

```

# Scripts Documentation
## Database Scripts

### Run migrate.js
```
npm run db:migrate
```

### Run seed.js
```
npm run db:seed
```

### Run drop.js
```
npm run db:drop
```

# Error Handling & Logging
## Error Handling Strategy

- Common Cases:

- Database connection errors → 500

- Query timeout / DB unavailable → 503 (Service Unavailable)

- Duplicate key violation (E11000) → 409 (Conflict)

- Validation errors → 400 (Bad Request) with detailed messages

- Resource not found → 404

# Logging

- Each request is logged (method, path, response time).

- Errors are logged with stack trace in development.

- In production, only safe messages are logged

# How to run this project

```
git clone <repo-url>
cd node-part-2
```