# Attendance Backend

## Description

The **Attendance Backend** is a RESTful API designed to handle attendance management for employees. It provides endpoints for user authentication and attendance tracking, along with scheduled cron jobs to send email notifications for reminders. The backend uses **JWT (JSON Web Tokens)** for secure authentication and supports the following features:

- **Authentication**: Uses JWT for secure user authentication.
- **Attendance Data Fetching**: API to fetch attendance data for employees.
- **Mark Attendance**: API to mark attendance for employees.
- **Email Reminders**: Cron jobs for sending reminder emails for attendance-related actions (e.g., marking attendance).
  
The backend is designed to work with the **Attendance Frontend** application, which interfaces with these APIs to allow employees and admins to manage attendance records.

---

## Features

- **JWT Authentication**: Secure login with JWT tokens for user authentication.
- **Attendance Fetching**: API to retrieve attendance records for employees.
- **Mark Attendance**: API for employees to mark their attendance.
- **Cron Jobs for Email Notifications**: Scheduled jobs to send reminders for marking attendance or upcoming attendance-related deadlines.
- **Role-based Access Control**: Differentiates between employee and admin roles, ensuring appropriate access and permissions.

---

## Installation

To set up the backend locally, follow these steps:

### Prerequisites

- Ensure that you have **Node.js** and **npm** installed on your machine.
- A database configured (I have used supabase. Since its a demo project)

### Steps

1. Clone the repository to your local machine:

  ```bash
  git clone <repository-url>
  cd attendance-backend
  ```

2. Install the required dependencies:

  ```bash
  npm install
  ```

3. Set up the environment variables by creating a .env file. Here's an example of what you may need:

  ```bash
  JWT_SECRET=<your-jwt-secret>
  DB_URI=<your-database-uri>
  PORT=5000
  ```

4. Start the development server:

  ```bash
  npm start
  ```

---

## License

  This project is licensed under the MIT License