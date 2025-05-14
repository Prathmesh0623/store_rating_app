Store Rating App
Overview
The Store Rating App is a full-stack web application that allows users to register, log in, view a list of stores, and rate them. It has three user roles:

Normal User: Can view stores and rate them.
Store Owner: Can add and manage stores.
Admin: Can manage users and stores.

The project is built with:

Frontend: React (running on http://localhost:3001)
Backend: NestJS (running on http://localhost:3000)
Database: MySQL

Project Structure
store-rating-app/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js    # Login and registration form
│   │   │   ├── Stores.js   # Store list for normal users
│   │   │   └── Owner.js    # Dashboard for store owners
│   │   └── App.js          # Main React app
│   ├── .env                # Environment variables (not in Git)
│   └── package.json
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module (register, login)
│   │   ├── users/          # User management
│   │   ├── stores/         # Store management
│   │   ├── ratings/        # Rating management
│   │   └── main.ts         # Entry point
│   ├── .env                # Environment variables (not in Git)
│   └── package.json
├── .gitignore             # Git ignore file
└── README.md              # Project documentation

Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (v16 or later): Download
MySQL: Download
Git: Download

Setup Instructions
1. Clone the Repository
Clone the project from GitHub:
git clone https://github.com/Prathmesh0623/store_rating_app.git
cd store-rating-app

2. Set Up the Database

Start your MySQL server.
Create a database named store_rating_db:CREATE DATABASE store_rating_db;


Update the backend .env file (see Step 3) with your MySQL credentials.

3. Configure Environment Variables
Backend
Create a .env file in the backend directory (store-rating-app/backend/.env) with the following:
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=your_mysql_username
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=store_rating_db
JWT_SECRET=your_jwt_secret


Replace your_mysql_username and your_mysql_password with your MySQL credentials.
Replace your_jwt_secret with a secure random string (e.g., mysecretkey123).

Frontend
Create a .env file in the frontend directory (store-rating-app/frontend/.env) with the following:
REACT_APP_API_URL=http://localhost:3000

4. Install Dependencies
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

5. Start the Backend
Run the NestJS backend:
cd backend
npm run start:dev


The backend will run on http://localhost:3000.

6. Start the Frontend
Run the React frontend in a separate terminal:
cd frontend
npm start


The frontend will run on http://localhost:3001.

7. Access the Application

Open your browser and go to http://localhost:3001/login.
Register a new user:
Name: Must be 20-60 characters.
Email: Valid email format (e.g., john@example.com).
Address: Max 400 characters.
Password: 8-16 characters, with at least one uppercase letter and one special character (e.g., Password!123).


Log in with the registered credentials.
Based on the role:
USER: Redirected to /stores to view and rate stores.
STORE_OWNER: Redirected to /owner to manage stores.
ADMIN: Redirected to /admin to manage users and stores.



Usage
Register and Log In

Go to http://localhost:3001/login.
Click "Sign Up" to register a new user.
Log in with your credentials.

For Normal Users (Role: USER)

After logging in, you’ll be redirected to /stores.
View the list of stores and rate them (1-5 stars).

For Store Owners (Role: STORE_OWNER)

Register with role: "STORE_OWNER" (you can modify the role in Login.js temporarily or use a direct API call).
After logging in, you’ll be redirected to /owner.
Add a new store with name, category, address, and description.

For Admins (Role: ADMIN)

Register with role: "ADMIN".
After logging in, you’ll be redirected to /admin.
Manage users and stores.

API Endpoints
Authentication

POST /auth/register: Register a new user.{
  "name": "John Doe Smith Normal User Long",
  "email": "john@example.com",
  "address": "123 Main St, City, Country",
  "password": "Password!123",
  "role": "USER"
}


POST /auth/login: Log in and get a JWT token.{
  "email": "john@example.com",
  "password": "Password!123"
}



Stores

GET /stores: List all stores (for normal users).
POST /stores: Add a new store (for store owners).

Ratings

POST /ratings: Submit a rating for a store (for normal users).

Troubleshooting

"Failed to register" Error:
Ensure REACT_APP_API_URL in frontend/.env is set to http://localhost:3000.
Check backend logs for validation errors.


Login Fails:
Verify the user exists in the database (SELECT * FROM user;).
Ensure the password matches (check bcrypt hashing in auth.service.ts).


CORS Issues:
The backend (main.ts) already enables CORS for http://localhost:3001. Ensure the backend is running.



Dependencies
Backend

NestJS
TypeORM
MySQL2
Bcrypt
JWT

Frontend

React
Axios
Bootstrap


