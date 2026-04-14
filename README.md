---
title: ShrmSetu Backend
emoji: 🏗️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# ShrmSetu Backend API

ShrmSetu is a worker marketplace platform connecting employers with skilled laborers in India.

## Overview

This is the backend API server for ShrmSetu, built with:
- **Node.js + Express** - REST API framework
- **Socket.io** - Real-time messaging
- **MongoDB** - Database
- **Docker** - Container deployment

## Features

- 🔐 Authentication & Authorization
- 👥 Worker & Employer Management
- 💼 Job Posting & Application
- 💬 Real-time Messaging
- 🎯 Skill Matching
- 📍 Location-based Services
- 🏪 Shop/Worker Profile Management

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Workers
- `GET /api/workers?skip=0&limit=10` - Get workers list
- `GET /api/workers/:id` - Get worker profile
- `POST /api/workers` - Create worker profile
- `PATCH /api/workers/:id` - Update worker profile

### Posts (Jobs)
- `GET /api/posts` - Get job listings
- `POST /api/posts` - Create job post
- `PATCH /api/posts/:id` - Update job post
- `DELETE /api/posts/:id` - Delete job post

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message
- `GET /api/messages/:conversationId` - Get conversation

### Skills
- `GET /api/skills` - Get available skills
- `POST /api/skills` - Add skill

## Environment Variables

```env
DATABASE_URL=mongodb://...
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
NODE_ENV=production
PORT=7860
```

## Deployment

Deployed on Hugging Face Spaces with Docker.

### Local Development

```bash
cd backend
npm install
npm run dev
```

### Production

```bash
npm start
```

## Technologies

- Node.js 18
- Express.js 5
- MongoDB 7
- Socket.io 4
- AWS S3
- JWT Authentication

## Project Links

- **Frontend:** React Native with Expo
- **GitHub Backend:** https://github.com/karanXtream/shrmSetuBackend
- **GitHub Frontend:** https://github.com/karanXtream/shrmSetu

## Support

For issues or questions, please refer to the GitHub repositories or contact the development team.

---

**Developed with ❤️ for Indian workers**
