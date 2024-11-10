
# Hear through the Grapevine
Grapevine is a full-stack web application for managing audio files with user authentication. The system consists of a Node.js backend service and a React frontend application.

## Running Instructions
1. Copy and paste the provided ENV variables provided into the root directory's `.env` file
2. Build and start the containers:
`docker-compose up --build`
3. The application will be available at:
- Frontend: http://localhost:3001 (Nginx server)
- Backend API: http://localhost:3000 (Node.js server)

## System Components

### 1. Backend Service

- **Framework**: Koa.js with TypeScript

- **Database**: PostgreSQL with Sequelize ORM

- **Storage**: AWS S3 for audio file storage

- **Authentication**: JWT-based with HTTP-only cookies


### 2. Frontend Application

- **Framework**: React with TypeScript

- **Build Tool**: Vite

- **Styling**: Tailwind CSS

- **Routing**: React Router


### 3. Deployment
- Containerized using Docker
- Nginx serving the frontend static files
- Environment configuration via `.env` files


## Database Schema
### Users Table

| Column    | Type      | Constraints                |
|-----------|-----------|---------------------------|
| id        | SERIAL    | PRIMARY KEY              |
| username  | VARCHAR   | NOT NULL, UNIQUE         |
| password  | VARCHAR   | NOT NULL                 |
| admin     | BOOLEAN   | DEFAULT false            |
| createdAt | TIMESTAMP | NOT NULL                 |
| updatedAt | TIMESTAMP | NOT NULL                 |

### AudioFiles Table

| Column      | Type      | Constraints                |
|-------------|-----------|---------------------------|
| id          | SERIAL    | PRIMARY KEY              |
| title       | VARCHAR   | NOT NULL                 |
| description | TEXT      | NOT NULL                 |
| userId      | INTEGER   | REFERENCES Users(id)     |
| fileUrl     | VARCHAR   | NOT NULL                 |
| metadata    | JSONB     |                         |
| createdAt   | TIMESTAMP | NOT NULL                 |
| updatedAt   | TIMESTAMP | NOT NULL                 |


# API Documentation

## Error Handling
If an error occured, an `error` key will be present in the response body.

## Authentication via cookies
All authenticated endpoints require a valid JWT token in the `auth-token` cookie. This cookie is automatically set after successful login and removed on logout.

## Authentication Endpoints
### **POST** `/auth/login`
Login with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "userId": "number",
  "admin": "boolean",
  "username": "string"
}
```
### **POST** `/auth/logout`
Logout the current user.

## Audio Files Endpoints

### **GET** `/audio_files`
List audio files with pagination and filtering.

**Query Parameters:**
| Parameter | Type   | Default | Description                    |
|-----------|--------|---------|--------------------------------|
| page      | number | 1       | Page number for pagination     |
| limit     | number | 10      | Number of items per page       |
| search    | string |         | Search term for filtering      |
| tags      | string |         | Comma-separated list of tags   |

   
**Response:**
```json
{
  "audioFiles": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "fileUrl": "string",
      "userId": "number",
      "metadata": {
        "key": "string",
        "tags": ["string"]
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number",
    "itemsPerPage": "number"
  }
}
```

### **POST** `/audio_files/presigned-url`
Get a pre-signed URL for uploading an audio file.

**Request Body:**
```json
{
  "fileName": "string", 
  "fileType": "string"
}
```

**Response:**
```json
{
  "presignedUrl": "string", 
  "key": "string"
}
```

### **GET** `/audio_files/:id/presigned-url`
Get a pre-signed URL for downloading/playing an audio file.

**Response:**
```json
{
  "presignedUrl": "string"
}
```

### **POST** `/audio_files`
Create a new audio file entry.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "key": "string",
  "tags": ["string"]
}
```

### **PUT** `/audio_files/:id`
Update audio file metadata.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "tags": ["string"]
}
```

### **DELETE** `/audio_files/:id`
Delete an audio file.

## User Management Endpoints (Admin Only)
### **GET** `/users`
List users with pagination.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 9)

**Response:**
```json
{
    "users": [
        {
            "id": "number",
            "username": "string",
            "admin": "boolean",
            "createdAt": "string",
            "updatedAt": "string"
        }
    ],
    "total": "number",
    "totalPages": "number"
}
```


### **POST** `/users`
Create a new user.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

### **PUT** `/users/:id`
Update user details.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

### **DELETE** `/users/:id`
Delete a user and associated files.

## Security Features
- JWT Authentication stored in HTTP-only cookies
- Password hashing using bcrypt 
- Admin-only routes protection
- User-specific file access control: users can only access their own files
- Input validation using Joi
- Secure file uploads using S3 presigned URLs

## File Storage
Audio files are stored in AWS S3 with the following structure:

```
uploads/
  ├── {userId}/
  │   ├── {timestamp}-{filename}
  │   └── ...
```
