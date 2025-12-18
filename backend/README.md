# TaskFlow Backend Setup

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MongoDB URI and JWT secret

4. Start the server:
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## API Documentation

See main README.md for complete API documentation.

## Database Schema

### User
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- avatar: String (auto-generated)
- role: String (user/admin)

### Project
- name: String (required)
- description: String (required)
- owner: ObjectId (User)
- members: [ObjectId] (Users)
- status: String (planning/active/on-hold/completed/archived)
- priority: String (low/medium/high/urgent)
- color: String (hex color)
- startDate: Date
- endDate: Date

### Task
- title: String (required)
- description: String (required)
- project: ObjectId (Project)
- assignedTo: ObjectId (User)
- createdBy: ObjectId (User)
- status: String (todo/in-progress/review/done)
- priority: String (low/medium/high/urgent)
- dueDate: Date
- tags: [String]
- comments: [Comment]
  - user: ObjectId (User)
  - text: String
  - createdAt: Date

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
