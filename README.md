# Student Management System

A simple CRUD application built with Next.js, Tailwind CSS, MongoDB, and Mongoose.

## Features

- Create a new student
- View all students
- Update student information
- Delete a student

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose

## Prerequisites

- Node.js 18 or later
- MongoDB (local or MongoDB Atlas)

## Installation

1. Clone the repository:

   git clone <your-repo-url>
   cd student-management

2. Install dependencies:

   npm install

3. Create a `.env.local` file in the project root and add:

   MONGODB_URI=mongodb://localhost:27017/student_management

   For MongoDB Atlas, use your connection string instead.

4. Start the development server:

   npm run dev

5. Open http://localhost:3000 in your browser.

## Project Structure

    student-management/
    ├── app/
    │   ├── api/
    │   │   └── students/
    │   │       ├── route.ts
    │   │       └── [id]/
    │   │           └── route.ts
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── lib/
    │   ├── mongodb.ts
    │   └── utils.ts
    ├── models/
    │   └── Student.ts
    ├── public/
    ├── .env.local
    └── package.json

## API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/students         | Get all students     |
| POST   | /api/students         | Create a new student |
| PUT    | /api/students/:id     | Update a student     |
| DELETE | /api/students/:id     | Delete a student     |

## Student Fields

- name (string, required)
- email (string, required, unique)
- phone (string, required)
- department (string, required)

## Notes

- The MongoDB connection is cached in `lib/mongodb.ts` to prevent multiple connections during development hot reload.
- The Student model uses the `mongoose.models.Student || mongoose.model(...)` pattern to avoid model overwrite errors in development.