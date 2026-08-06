# Book Collection API

A RESTful API for managing a personal book collection. Supports user registration, login (JWT-based authentication) and full CRUD operations on books, with strict data isolation between users.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express
- **Database**: PostgreSQL (`pg`)
- **Authentication**: JWT (`jsonwebtoken`) + `bcrypt`
- **Version Control**: Git + Conventional Commits

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.config.js         # PostgreSQL connection pool
│   ├── controllers/             # Handle req/res, call services
│   ├── services/                # Business logic
│   ├── repositories/            # Direct database access
│   ├── dtos/                    # Input validation
│   ├── middlewares/             # authenticate, error handler
│   ├── routes/                  # Map paths to controllers
│   └── utils/                   # AppError, asyncHandler
├── app.js                       # Entry point
├── package.json
└── .env                         # Not committed to git
```

**Architecture**: Route → Controller → Service → Repository (layered architecture) with clear separation of concerns at each layer.

## Installation

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file in `server/`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/book_collection_db
JWT_SECRET=your_random_secret_key
```

### Database Setup

```sql
CREATE DATABASE book_collection_db;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE books (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    published_year INTEGER,
    owner_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_books_owner
        FOREIGN KEY (owner_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
```

### Running the Server

```bash
npm start        # production
npm run dev       # development (auto-restart with nodemon)
```

The server runs at `http://localhost:5000`

---

## API Documentation

Base URL: `http://localhost:5000`

Protected endpoints require this header on every request:

```
Authorization: Bearer <token>
```

---

### Authentication

#### 1. Register

```
POST /auth/register
```

**Headers**

```
Content-Type: application/json
```

**Request Body**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

| Field    | Type   | Required | Constraints                  |
| -------- | ------ | -------- | ---------------------------- |
| email    | string | ✅       | Must be a valid email format |
| password | string | ✅       | At least 8 characters        |

**Response `201 Created`**

```json
{
  "message": "Register successful",
  "data": {
    "id": 1,
    "email": "test@example.com",
    "created_at": "2026-08-06T10:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Condition                         | Response                                                       |
| ------ | --------------------------------- | -------------------------------------------------------------- |
| 400    | Missing or invalid email/password | `{ "status": "error", "message": "email format is invalid" }`  |
| 409    | Email already registered          | `{ "status": "error", "message": "Email already registered" }` |

---

#### 2. Login

```
POST /auth/login
```

**Headers**

```
Content-Type: application/json
```

**Request Body**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response `200 OK`**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

**Error Responses**

| Status | Condition                   | Response                                                              |
| ------ | --------------------------- | --------------------------------------------------------------------- |
| 400    | Missing email/password      | `{ "status": "error", "message": "email and password are required" }` |
| 401    | Incorrect email or password | `{ "status": "error", "message": "Invalid email or password" }`       |

> The token expires in 2 hours. After expiry, the user must log in again.

---

#### 3. Logout

```
POST /auth/logout
```

No body or token required. Since JWT is stateless, the client is responsible for discarding the stored token after calling this endpoint.

**Response `200 OK`**

```json
{
  "message": "Logout successful"
}
```

---

### Books

Every endpoint in this section requires `Authorization: Bearer <token>`. Each user can only view, update, or delete their own books (automatically filtered by `owner_id` from the token).

#### 1. Get all books

```
GET /books
```

**Response `200 OK`**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "genre": "Programming",
      "published_year": 2008,
      "owner_id": 1,
      "created_at": "2026-08-06T10:05:00.000Z"
    }
  ]
}
```

---

#### 2. Get a single book

```
GET /books/:bookId
```

**Response `200 OK`**

```json
{
  "data": {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Programming",
    "published_year": 2008,
    "owner_id": 1,
    "created_at": "2026-08-06T10:05:00.000Z"
  }
}
```

**Error `404 Not Found`** — Book doesn't exist, or belongs to another user

```json
{
  "status": "error",
  "message": "Book not found"
}
```

---

#### 3. Create a book

```
POST /books
```

**Headers**

```
Content-Type: application/json
```

**Request Body**

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "Programming",
  "publishedYear": 2008
}
```

| Field         | Type    | Required | Constraints        |
| ------------- | ------- | -------- | ------------------ |
| title         | string  | ✅       | Max 255 characters |
| author        | string  | ✅       | Max 255 characters |
| genre         | string  | ❌       | Max 100 characters |
| publishedYear | integer | ❌       | Must be an integer |

**Response `201 Created`**

```json
{
  "message": "Book created successfully",
  "data": {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Programming",
    "published_year": 2008,
    "owner_id": 1,
    "created_at": "2026-08-06T10:05:00.000Z"
  }
}
```

**Error `400 Bad Request`**

```json
{
  "status": "error",
  "message": "title is required and must not exceed 255 characters"
}
```

---

#### 4. Update a book

```
PUT /books/:bookId
```

Supports partial updates — you only need to send the fields you want to change.

**Headers**

```
Content-Type: application/json
```

**Request Body** (example: update genre only)

```json
{
  "genre": "Software Engineering"
}
```

**Response `200 OK`**

```json
{
  "message": "Book updated successfully",
  "data": {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Software Engineering",
    "published_year": 2008,
    "owner_id": 1,
    "created_at": "2026-08-06T10:05:00.000Z"
  }
}
```

**Error Responses**

| Status | Condition                                 | Response                                                                            |
| ------ | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| 400    | No fields provided, or invalid values     | `{ "status": "error", "message": "at least one field must be provided to update" }` |
| 404    | Book not found, or not owned by this user | `{ "status": "error", "message": "Book not found" }`                                |

---

#### 5. Delete a book

```
DELETE /books/:bookId
```

**Response `200 OK`**

```json
{
  "message": "Book deleted successfully"
}
```

**Error `404 Not Found`**

```json
{
  "status": "error",
  "message": "Book not found"
}
```

---

### Health Check

```
GET /health
```

Checks server status and database connectivity. No token required.

**Response `200 OK`**

```json
{
  "status": "ok",
  "database": "connected"
}
```

**Response `503 Service Unavailable`** — Database connection failed

```json
{
  "status": "error",
  "database": "disconnected"
}
```

---

### Standard Error Response

Errors not covered above follow this same shape:

```json
{
  "status": "error",
  "message": "error details here"
}
```

| Status Code | Meaning                                                |
| ----------- | ------------------------------------------------------ |
| 400         | Invalid request data (validation error)                |
| 401         | Missing/invalid/expired token, or wrong email-password |
| 404         | Requested resource not found                           |
| 409         | Conflict with existing data (e.g. duplicate email)     |
| 500         | Unexpected server error                                |

---

## Security

- Passwords are hashed with `bcrypt` before being stored; plain text passwords are never saved.
- Every query on `books` enforces `WHERE owner_id = $N` — each user can only see, update, or delete their own books.
- `owner_id` is always taken from the verified JWT payload, never from the request body.
- All database queries use parameterized queries (`$1, $2, ...`) to prevent SQL Injection.

## Git Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add a new feature
fix: fix a bug
chore: setup/infrastructure work not directly visible to end users
docs: documentation changes
refactor: restructure code without changing behavior
```

Examples:

```
feat: add book CRUD endpoints
fix: correct typo in owner_id column name
docs: add api documentation to readme
```
