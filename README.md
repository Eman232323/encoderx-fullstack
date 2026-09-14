EncoderX Full Stack Task Manager

A full-stack Task Management application developed as part of the EncoderX Remote Internship Batch 02 Full Stack Development Task.

🚀 Tech Stack

Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

✨ Features

- User Registration
- User Login
- Secure Password Hashing
- JWT Authentication
- Protected Routes
- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- Task Status Management
- Task Priority Management
- Search Tasks
- Filter Tasks
- Responsive Dashboard

📂 Project Structure

encoderx-fullstack/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── README.md

🔐 Authentication

The application uses JWT-based authentication. Passwords are securely hashed using bcryptjs before being stored in the database.

Protected task routes require a valid authentication token.

📡 API Endpoints

Authentication

Method| Endpoint| Description
POST| "/api/auth/register"| Register a new user
POST| "/api/auth/login"| Login user

Tasks

Method| Endpoint| Description
POST| "/api/tasks"| Create a task
GET| "/api/tasks"| Get user tasks
PUT| "/api/tasks/:id"| Update a task
DELETE| "/api/tasks/:id"| Delete a task

📝 Task Fields

Each task can contain:

- Title
- Description
- Due Date
- Status
- Priority
- User ID

Status Options

- Pending
- In Progress
- Completed

Priority Options

- Low
- Medium
- High

🧪 API Testing

All major APIs were tested successfully using Postman, including:

- Register
- Login
- Create Task
- Get Tasks
- Update Task
- Delete Task

Postman collection name:

EncoderX Full Stack

⚙️ Running the Project Locally

Backend

Open a terminal in the "backend" folder and run:

npm install
npm start

The backend runs on:

http://localhost:5000

Frontend

Open another terminal in the "frontend" folder and run:

npm install
npm run dev

The frontend runs on the Vite development server.

🗄️ Database

MongoDB Atlas is used as the database.

The backend connects to MongoDB Atlas using a connection string stored securely in environment variables.

👩‍💻 Developer

Developed by Eman as part of the EncoderX Remote Internship Batch 02.

✅ Backend completed
✅ Authentication completed
✅ Task CRUD APIs completed
✅ MongoDB Atlas connected
✅ Postman API testing completed
✅ React frontend completed
🔄 Final GitHub upload and deployment
