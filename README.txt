NextGen-Learning E-Learning Platform
============================

A modern web-based e-learning platform built with Node.js, Express, MongoDB, and vanilla JavaScript.

Project Overview
---------------
NextGen-Learning is a free e-learning platform that allows users to access educational courses across various technology domains. The platform features user authentication, course enrollment, and interactive learning materials.

Tech Stack
----------
Backend:
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- bcryptjs (Password hashing)
- CORS enabled

Frontend:
- HTML5
- CSS3
- Vanilla JavaScript
- AOS (Animate On Scroll library)
- Typed.js (Text animation)
- Font Awesome (Icons)
- Google Fonts

Features
--------
1. User Authentication
   - Secure signup/login system
   - Password hashing
   - Session management using localStorage
   - Last login tracking

2. Course Management
   - Free course access
   - Course enrollment system
   - Course progress tracking
   - Student count tracking

3. User Interface
   - Responsive design
   - Modern animations
   - Interactive forms
   - Dynamic content loading
   - Mobile-friendly layout

4. Contact System
   - Contact form with backend storage
   - Newsletter subscription
   - Social media integration

Database Schema
--------------
1. User Collection (Login/Signup)
   - name: String (required)
   - email: String (required, unique)
   - password: String (required, hashed)
   - createdAt: Date
   - lastLogin: Date

2. Course Collection
   - id: String
   - title: String
   - description: String
   - image: String
   - duration: String
   - instructor: String
   - totalStudents: Number

3. Enrollment Collection
   - courseId: String
   - studentName: String
   - email: String
   - phone: String
   - enrollmentDate: Date
   - paymentStatus: String

4. Contact Collection
   - name: String
   - email: String
   - message: String

API Endpoints
------------
Authentication:
- POST /signup - Register new user
- POST /login - User login
- GET /api/users - Get all users (testing only)

Courses:
- GET /api/courses - Get all courses
- GET /api/courses/:id - Get single course
- POST /api/enroll - Enroll in a course

Contact:
- POST /contact - Submit contact form

Setup Instructions
-----------------
1. Install MongoDB locally
2. Clone the repository
3. Run 'npm install' to install dependencies
4. Start MongoDB service
5. Run 'node server.js' to start the application
6. Access the application at http://localhost:5000

Dependencies
-----------
- express: Web framework
- mongoose: MongoDB object modeling
- cors: Cross-origin resource sharing
- bcryptjs: Password hashing
- path: File path operations 