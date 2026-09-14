Task Management App — Backend

A RESTful backend API for a full-stack Task Management Application, built using Node.js, Express.js, and MongoDB.

🚀 Features

- User Registration
- User Login
- Password Hashing with bcrypt
- JWT Authentication
- Protected API Routes
- Create Tasks
- Get Tasks
- Update Tasks
- Delete Tasks
- MongoDB Atlas Database
- RESTful API Architecture

🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- CORS

📌 API Endpoints

Authentication

Method| Endpoint| Description
POST| "/api/auth/register"| Register a new user
POST| "/api/auth/login"| Login user

Tasks

Method| Endpoint| Description
POST| "/api/tasks"| Create a new task
GET| "/api/tasks"| Get all tasks
PUT| "/api/tasks/:id"| Update a task
DELETE| "/api/tasks/:id"| Delete a task

All task routes are protected and require authentication.

⚙️ Installation

Open the Backend folder in the terminal and install dependencies:

npm install

🔐 Environment Variables

Create a ".env" file in the Backend folder and add your MongoDB connection string and JWT secret.

Example:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

Do not upload the ".env" file to GitHub.

▶️ Run the Server

Start the backend server with:

npm start

Or, if your project uses nodemon:

npm run dev

The backend runs locally on:

http://localhost:5000

🧪 API Testing

All authentication and Task CRUD APIs have been successfully tested using Postman.

Tested operations:

- Register
- Login
- Create Task
- Get Tasks
- Update Task
- Delete Task

📂 Project Status

Backend development, authentication, protected routes, MongoDB Atlas integration, and Task CRUD APIs are completed and tested.

👨‍💻 Internship

EncoderX Remote Internship — Batch 02
Full Stack Development — Task 1