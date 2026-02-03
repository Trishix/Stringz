# Backend - Stringz Learning Platform

Production-ready backend for the Stringz Learning Platform.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis (for rate limiting)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in credentials:
   ```bash
   cp .env.example .env
   ```

### Running Locally
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Start Production**: `npm start`
- **Test**: `npm test`

## 🛠 Tech Stack
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Caching**: Redis
- **Auth**: JWT
- **Validation**: express-validator, Zod
- **Logging**: Winston
- **Testing**: Jest, Supertest

## 🔒 Environment Variables
See `.env.example` for the full list of required variables.

## 📦 API Documentation
Swagger docs are available at `/api-docs` when the server is running.
Swagger file: `swagger.yaml`

## 🐳 Docker
Build and run with Docker:
```bash
docker build -t backend .
docker run -p 4000:4000 --env-file .env backend
```

## ⚠️ Manual Action Required
- **Strict Rate Limiting**: Production Redis instance is required.
- **Email Service**: Resend API key is mandatory.
- **Payment**: Razorpay credentials required for payments.

## License
Private
