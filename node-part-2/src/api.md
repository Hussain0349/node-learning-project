# Base URL
```
http://localhost:3000/api/books 
```
## Validation Rules

- title — required, non-empty string

- author — required, non-empty string

- year — required, integer between 1000 and current year (inclusive)

- genre — optional, if provided must be a non-empty string

- Duplicate titles (case-insensitive) are rejected on POST.

## Endpoints

#### 1. Get All Books

```
GET /api/books
```
### Query parameters

- sort — title | author | year (optional)

- order — asc | desc (optional, default asc)

- page — integer (optional, default 1)

- limit — integer (optional, default = all)

```
GET /api/books?sort=year&order=desc&page=1&limit=2
```

#### **Success (200)**
```
{
  "page": 1,
  "limit": 2,
  "total": 3,
  "data": [
    {
      "id": 2,
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "year": 1960,
      "genre": "Fiction"
    },
    {
      "id": 3,
      "title": "1984",
      "author": "orwell",
      "year": 1949,
      "genre": "Dystopian"
    }
  ]
} 
```
### **Errors**

- 400 Validation errors

```
{
  "errors": [
    "Title must be a non-empty string",
    "Year must be a number between 1000 and 2025"
  ]
}

```

### **Update a Book**
```
PUT /api/books/:id
Content-Type: application/json
```

### Include requests for:

- GET /api/books (with several query param examples)

- GET /api/books/:id (valid and invalid)

- POST /api/books (valid, validation error, duplicate title)

- PUT /api/books/:id (valid and invalid)

- DELETE /api/books/:id (valid and invalid)

- GET /api/books/search

- GET /api/books/count
