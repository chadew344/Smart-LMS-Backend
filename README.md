# Smart Learning Management System - Backend

> A RESTful API built with Express.js, TypeScript, and MongoDB for [brief description of your application]

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.19+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2+-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)

## 🚀 Live Demo

- **Backend API:** [smart-lms-backend.vercel.app](https://smart-lms-backend.vercel.app)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

<a id="features"></a>

## ✨ Features

- **RESTful API Design** - Clean and intuitive endpoints following REST principles
- **JWT Authentication** - Secure user authentication with access and refresh tokens
- **Role-Based Authorization** - Multi-level user access control (Admin, Student, Instructor)
- **Input Validation** - Robust request validation using Zod
- **Error Handling** - Centralized error handling with custom error classes
- **MongoDB Integration** - Mongoose ODM with schema validation and indexing
- **TypeScript** - Full type safety across the entire codebase
- **Security** - Password encryption with bcryptjs, CORS, helmet, rate limiting
- **Advanced Feature** - Payment Gateway, AI integration, PDF generation, and automated emails

<a id="tech-stack"></a>

## 🛠️ Tech Stack

### Core Technologies

- **Runtime:** Node.js v22+
- **Language:** TypeScript 5.9+
- **Framework:** Express.js 5.2+
- **Database:** MongoDB Atlas
- **ODM:** Mongoose 9.0+

### Authentication & Security

- **JWT:** jsonwebtoken
- **Password Hashing:** bcryptjs
- **CORS:** cors
- **Security Headers:** helmet
- **Rate Limiting:** express-rate-limit
- **Cookies:** cookie-parser

### Validation & Utilities

- **Validation:** Zod v4+
- **Environment Variables:** dotenv
- **Global Error Handling:** express-async-handler

### File Upload & Media Management

- **File Uploads:** Multer
- **Cloud Storage:** Cloudinary

### Advanced Features

- **Payment gatway**: Stripe
- **AI integration**: Gemini API
- **PDF generation**: PDFKit
- **Email**: Nodemailer (automated emails)

<a id="system-architecture"></a>

## 🏗️ System Architecture

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼─────────────────────────────┐
│         Express Server             │
│  ┌──────────────────────────────┐  │
│  │     Middleware Layer         │  │
│  │  - CORS                      │  │
|  |  - Cookie Parser             |  |
│  │  - Helmet                    │  │
│  │  - Rate Limiting             │  │
│  │  - JWT Authentication        │  │
│  │  - Error Handler             │  │
|  |  - Zod Validiton             |  |
|  |  - Multer File Handling      |  |
│  └──────────┬───────────────────┘  │
│             │                      │
│  ┌──────────▼───────────────────┐  │
│  │     Routes Layer             │  │
│  │  - /api/auth                 │  │
│  │  - /api/users                │  │
│  │  - /api/courses              │  │
│  │  - /api/entrollments         │  │
|  |  - /api/progress             |  |
|  |  - /api/upload               |  |
│  └──────────┬───────────────────┘  │
│             │                      │
│  ┌──────────▼───────────────────┐  │
│  │   Controllers Layer          │  │
│  │  - Business Logic            │  │
│  │  - Request/Response Handling │  │
│  └──────────┬───────────────────┘  │
│             │                      │
│  ┌──────────▼───────────────────┐  │
│  │     Services Layer           │  │
│  │  - Advanced Features         │  │
│  │  - External API Integration  │  │
│  └──────────┬───────────────────┘  │
│             │                      │
│  ┌──────────▼───────────────────┐  │
│  │     Models Layer             │  │
│  │  - Mongoose Schemas          │  │
│  │  - Data Validation           │  │
│  └──────────┬───────────────────┘  │
└─────────────┼──────────────────────┘
              │
              │
     ┌────────▼─────────┐
     │   MongoDB Atlas  │
     │    (Database)    │
     └──────────────────┘
```

<a id="getting-started"></a>

## 🚦 Getting Started

### Prerequisites

- Node.js v22 or higher
- npm or yarn
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/chadew344/Smart-LMS-Backend.git
   cd Smart-LMS-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example.env
   ```

   Then edit `.env` with your actual values (see [Environment Variables](#environment-variables))

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Start production server**
   ```bash
   npm start
   ```

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm test             # Run tests (if configured)
```

<a id="environment-variables"></a>

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development


# Database

# For local development
MONGO_URI=mongodb://localhost:27017/<dbname>

# For production / cloud (MongoDB Atlas)
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority


# CORS
ALLOWED_ORIGINS=http://localhost:5173


# JWT Secrets
JWT_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d


# External APIs

# Cloudinary -
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=your-custom-folder-name


# AI Integration
GEMINI_API_KEY=AI-your-gemini-api-key

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password


# OAuth

GOOGLE_CLIENT_ID=your-google-client-id-paste-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-paste-here
```

<a id="api-documentation"></a>

## 📚 API Documentation

### Base URL

- **Production:** `https://backend-url.com/api`
- **Development:** `http://localhost:5000/api/v1`

### Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "statusCode": 400,
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Success Responses

All success follow this format:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id-12345",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "roles": ["STUDENT"]
    },
    "accessToken": "<YOUR_ACCESS_TOKEN>"
  }
}
```

Common HTTP Status Codes:

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

<a id="database-schema"></a>

## 💾 Database Schema

The Smart LMS uses a **Hybrid Document Architecture**. While most data is relational, the course curriculum uses **Deeply Nested Sub-documents** to allow for high-performance retrieval of entire course structures in a single query.

### 🏗️ Data Models

#### 1. Course & Curriculum (Nested Structure)

Instead of multiple joins, the curriculum hierarchy is stored within the Course document for atomic updates and fast reads.

- **Course (Root):** Metadata, pricing, and instructor ref.
- **Modules (Array):** Sub-documents containing groups of lessons.
- **Lessons (Nested Array):** Supports **Polymorphic Content** (Video, Reading, or Quiz).

#### 2. Authentication & Security (Refresh Tokens)

To support secure session management, we use a dedicated `RefreshToken` collection.

- **TTL Indexing:** Uses `expireAfterSeconds: 0` on the `expiresAt` field. This allows MongoDB to automatically delete expired sessions, ensuring the database remains clean without manual cron jobs.
- **User Linking:** Strict `ref: "User"` relationship to maintain session integrity.

### 🔗 Model Relationships & Flow

| Entity                       | Type       | Description                                                        |
| :--------------------------- | :--------- | :----------------------------------------------------------------- |
| **User ↔ Course**            | `1 : N`    | One Instructor manages multiple courses.                           |
| **Course ↔ Module ↔ Lesson** | `Embedded` | Hierarchical curriculum for 1-query fetching.                      |
| **User ↔ RefreshToken**      | `1 : 1`    | Managed session persistence and token rotation.                    |
| **Lesson ↔ Quiz**            | `Ref`      | Lessons link to assessments via `quizId`.                          |
| **Progress**                 | `1 : 1`    | Tracks a specific Student's completion percentage within a Course. |

---

### ⚙️ Automated Schema Intelligence

The system reduces frontend logic by automating data calculations within the database layer using **Mongoose Middleware**:

#### **Pre-save Aggregation**

Whenever a Course is created or updated, a `pre("save")` hook triggers:

1. **Total Lessons:** Automatically counts all lessons across all modules.
2. **Total Duration:** Sums the `duration` of every nested lesson.

```typescript
// Example of the logic implemented
CourseSchema.pre("save", function () {
  this.totalLessons = this.modules.reduce(
    (total, m) => total + m.lessons.length,
    0
  );
  this.totalDuration = this.modules.reduce((total, m) => {
    return total + m.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
  }, 0);
});
```

<a id="authentication"></a>

## 🔒 Authentication

### JWT Strategy

This API uses JWT (JSON Web Tokens) for authentication with a dual-token system:

1. **Access Token**

   - Short-lived (15 minutes)
   - Used for API requests
   - Stored in memory (frontend)

2. **Refresh Token**
   - Long-lived (7 days)
   - Used to obtain new access tokens
   - Stored in httpOnly cookie or secure storage

### Password Security

- Passwords hashed using bcryptjs with salt rounds of 12
- Minimum password requirements enforced in validation
- Never stored in plain text

### Role-Based Access Control (RBAC)

```typescript
// Middleware usage example
export enum Role {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
}

router.post(
  "/instructor-only",
  authenticate,
  authorize([Role.INSTRUCTOR]),
  controller
);
router.get(
  "/student-or-admin",
  authenticate,
  authorize([Role.STUDENT, Role.ADMIN]),
  controller
);
```

Roles:

- **Admin**: Manages and maintains the platform.
- **Instructor**: Creates and manages courses.
- **Student**: Enrolls in courses and learns.

<a id="deployment"></a>

## 🚀 Deployment

This project can be deployed easily using **Vercel** for the backend and **MongoDB Atlas** for the database.

### Steps

1. **Set up MongoDB Atlas**

   - Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a database and user.
   - Get your connection string (MONGO_URI).

2. **Deploy Backend on Vercel**

   - Go to [Vercel](https://vercel.com/) and create a new project.
   - Connect your GitHub repository.
   - Set environment variables (see [Environment Variables](#environment-variables)), especially `MONGO_URI` and JWT secrets.
   - Vercel will automatically build and deploy your backend.

3. **Access your API**
   - After deployment, Vercel provides a URL like:
     ```
     https://your-project-name.vercel.app/api
     ```
   - You can use this URL in your frontend or API clients.

<a id="project-structure"></a>

## 📁 Project Structure

```
backend/
├── src
│   ├── config
│   │   ├── cloudinary.ts                 # Cloud Storage Conig
│   │   ├── email.config.ts               # Email config (Gmail)
│   │   ├── googleOAuth.ts
│   │   └── stripe.config.ts              # Payment Gatway config(stripe)
│   ├── controllers
│   │   ├── ai.controller.ts              # Intergrate with Gemini
│   │   ├── auth.controller.ts
│   │   ├── course.controller.ts
│   │   ├── email.controller.ts
│   │   ├── enrollement.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── progress.controller.ts
│   │   └── upload.controller.ts
│   ├── middleware
│   │   ├── auth.middleware.ts             # JWT authentication and Role-based authorization
│   │   ├── error.middleware.ts            # Global error handler
│   │   ├── upload.middleware.ts           # File Handling
│   │   └── validate.middleware.ts         # Input validation
│   ├── models
│   │   ├── course.model.ts
│   │   ├── enrollment.model.ts
│   │   ├── progress.model.ts
│   │   ├── quiz.model.ts
│   │   ├── refreshToken.model.ts
│   │   ├── submission.model.ts
│   │   └── user.model.ts
│   ├── routes
│   │   ├── ai.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── course.routes.ts
│   │   ├── email.routes.ts
│   │   ├── enrollement.routes.ts
│   │   ├── progess.routes.ts
│   │   ├── progress.routes.ts
│   │   └── upload.routes.ts
│   ├── types                                 # Custom Types
│   │   ├── auth.types.ts
│   │   ├── course.type.ts
│   │   ├── email.type.ts
│   │   └── payment.types.ts
│   ├── utils
│   │   ├── ApiError.ts
│   │   ├── asyncHandler.ts
│   │   ├── emailText.ts                     # Email text templates notifications
│   │   ├── jwt.util.ts
│   │   └── successResponse.ts
│   ├── validate                              # Zod validation schemas
│   |    ├── auth.schema.ts
│   |    ├── course.schema.ts
│   |    ├── email.schema.ts
│   |    ├── enrollment.schema.ts
│   |    ├── progress.schema.ts
│   |    └── submission.schema.ts
│   └── index.ts                               # Server entry point
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, contact: chanuthdewhan273@gmail.com

---

**Note:** This project was developed by a student as part of the Rapid API Development module.
