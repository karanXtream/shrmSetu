# 🏗️ ShrmSetu (श्रमसेतु)

### 🌐 Deployed Portal: Deployed on Hugging Face Spaces with Docker 🐳

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Framework](https://img.shields.io/badge/Backend-Express.js%20v5-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20v7-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%20Native%20%2F%20Expo-blue?style=for-the-badge&logo=react)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**ShrmSetu** is a transformative, production-grade worker marketplace platform engineered specifically to bridge the communication and accessibility gap between employers and skilled/unskilled laborers across India. By offering transparent job postings, real-time location-based matching, and direct communication channels, ShrmSetu streamlines the unorganized labor sector into a structured, user-friendly digital ecosystem.

---

## 🚀 Key Features

| Feature | Description |
|--------|-------------|
| 🔐 **Dual-Role Authentication** | Secure access control separated dynamically for Workers and Employers powered by JWT |
| 💼 **Comprehensive Job Lifecycle** | Complete CRUD system for creating, updating, deleting, and tracking job applications |
| 💬 **Real-Time Messaging** | Instantaneous, persistent chatting interface built over Socket.io for transparent negotiations |
| 📍 **Location-Based Discovery** | Advanced querying to find proximate jobs or workers seamlessly |
| 🎯 **Intelligent Skill Matching** | Dynamic tag and category infrastructure ensuring the right worker gets the right job |
| 📱 **Multi-Language Support** | Localized experience tailored for diverse regional user groups |

---

## 📂 Project Architecture

The repository houses a unified codebase structure incorporating both the production API backend and the cross-platform mobile frontend application:

```text
shrmSetu/
├── backend/                        # Node.js + Express REST API Server
│   ├── config/                     # Database and Third-party configurations
│   ├── controllers/                # Core Business Logic handlers
│   ├── models/                     # MongoDB Schemas (User, Job, Message, etc.)
│   ├── routes/                     # API Route Definitions
│   ├── middleware/                 # Auth guards & error handlers
│   ├── package.json
│   └── server.js                   # Application Entry Point
├── frontend/                       # Client Application (React Native + Expo)
│   ├── components/                 # Reusable UI elements
│   ├── screens/                    # View layouts (Auth, Dashboard, Chat)
│   ├── hooks/                      # TanStack Query & state infrastructure
│   └── package.json
├── Dockerfile                      # Container configuration for deployment
├── .dockerignore                   # Specifies files to exclude from Docker builds
├── SOCKET_CONNECTION_DIAGNOSTIC.md # Networking troubleshooting documentation
└── MESSAGE_PERSISTENCE_README.md   # Architectural overview for real-time systems
```

---

## 🛠️ Tech Stack & Dependencies

| Module | Core Technologies | Key Ecosystem Libraries |
|--------|------------------|------------------------|
| ⚙️ **Backend** | Node.js (v18), Express 5, JavaScript | Socket.io, Mongoose, JWT, AWS S3 SDK |
| 📱 **Frontend** | React Native, Expo | TanStack Query, Expo Router, Axios |
| 🗄️ **Database** | MongoDB (v7) | Cloud Hosted / Atlas compatible |
| 🐳 **DevOps** | Docker, Hugging Face Spaces | Containerized execution environment |

---

## 🔌 API Reference Layout

### 🔐 Authentication Module

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Registers a new User (Worker/Employer) | ❌ No |
| `POST` | `/api/auth/login` | Authenticates user and returns JWT Token | ❌ No |
| `POST` | `/api/auth/logout` | Invalidates session / clears local token | ✅ Yes |

### 👥 Workers Profile Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/workers?skip=0&limit=10` | Fetch paginated lists of workers | ✅ Yes |
| `GET` | `/api/workers/:id` | Fetch specific details of a single worker | ✅ Yes |
| `POST` | `/api/workers` | Create a new worker professional profile | ✅ Yes |
| `PATCH` | `/api/workers/:id` | Update specified worker profile parameters | ✅ Yes |

### 💼 Jobs & Posts Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/posts` | Retrieve available job listings based on criteria | ✅ Yes |
| `POST` | `/api/posts` | Create/Publish a new job opening | ✅ Yes |
| `PATCH` | `/api/posts/:id` | Modify an active job posting | ✅ Yes |
| `DELETE` | `/api/posts/:id` | Permanently remove a job opening | ✅ Yes |

### 💬 Real-Time Messaging Core

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/messages` | Fetch history of active conversations | ✅ Yes |
| `POST` | `/api/messages` | Dispatch a secure chat message | ✅ Yes |
| `GET` | `/api/messages/:conversationId` | Retrieve individual historical logs | ✅ Yes |

### 🎯 Skill Tags Directory

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/skills` | Fetch all standardized skills listed | ❌ No |
| `POST` | `/api/skills` | Inject a new skill category into global directory | ✅ Yes *(Admin)* |

---

## ⚙️ Robust Local Setup Guide

Follow these steps to safely spin up a localized copy of ShrmSetu for development:

### 📋 1. Prerequisites

Ensure you have the following installed locally:

- ✅ **Node.js** (v18.x or above)
- ✅ **MongoDB** (Local Community Server or Atlas URI)
- ✅ **Git**

---

### 🔑 2. Environment Variables Configuration

Create a `.env` file within your `/backend` directory. Use the template block below to format your configurations properly:

```env
# 🖥️ Server Configuration
PORT=7860
NODE_ENV=development

# 🗄️ Database Settings
DATABASE_URL=mongodb://localhost:27017/shrmsetu
MONGODB_URI=mongodb://localhost:27017/shrmsetu

# 🔒 Security Tokens
JWT_SECRET=your_super_secure_jwt_random_secret_string

# ☁️ Cloud Storage Credentials (AWS S3)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1
```

---

### 🏗️ 3. Setting Up Backend API Server

```bash
# Navigate to the backend directory
cd backend

# Install production and development dependencies
npm install

# Start development server with automated hot-reloading
npm run dev
```

> 🟢 The server will gracefully bind and execute locally at **`http://localhost:7860`**

---

### 📱 4. Setting Up Frontend App

```bash
# Navigate to the frontend directory
cd ../frontend

# Install node dependencies
npm install

# Launch Expo Client / Metro bundler
npx expo start
```

> 📲 Scan the QR code generated in your terminal via the **Expo Go** application on iOS/Android to run the application dynamically.

---

### 🐳 5. Containerized Production Deployment

ShrmSetu utilizes containerization to guarantee deterministic environments across execution instances:

```bash
# Build the production docker image locally
docker build -t shrmsetu:latest .

# Instantiate and run container mapped to default exposure ports
docker run -p 7860:7860 --env-file ./backend/.env shrmsetu:latest
```

---

## 🤝 Contributing Guidelines

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated under the **Nexus Spring of Code** guidelines.

1. 🍴 **Fork** the Project Repository
2. 🌿 **Create** your Feature Branch — `git checkout -b feature/AmazingFeature`
3. 💬 **Commit** your Changes — `git commit -m 'feat: add some amazing new features'`
4. 📤 **Push** to the Branch — `git push origin feature/AmazingFeature`
5. 🚀 **Open** a well-documented Pull Request

> 📄 Please make sure to read the standard `CONTRIBUTING.md` and adhere strictly to the project's `CODE_OF_CONDUCT.md` to ensure positive and collaborative interactions.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` inside the repository for more information.

---

<div align="center">

Developed with ❤️ for Indian workers

</div>

