# 🎸 Stringz - Master the Guitar

![Stringz Banner](https://images.unsplash.com/photo-1510915361408-5435ebbb264e?q=80&w=2670&auto=format&fit=crop)

> **Master the art of guitar with premium video courses from world-class instructors.**

Stringz is a modern, full-stack E-learning platform designed for guitar enthusiasts. From beginner chords to advanced solos, Stringz offers a seamless learning experience with high-quality video lessons, progress tracking, and secure payments.

---

## 🚀 Live Demo

| Service | URL | Status |
| :--- | :--- | :--- |
| **Frontend** | [https://stringz-lijo.vercel.app](https://stringz-lijo.vercel.app) | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) |
| **Backend** | [https://stringz.onrender.com](https://stringz.onrender.com) | ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white) |
| **Database** | MongoDB Atlas | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) |

---

## ✨ Features

-   **🎥 High-Quality Video Lessons**: Stream 4K lessons with an integrated video player.
-   **🔐 Secure Authentication**: JWT-based login/signup with role-based access control (Student/Admin).
-   **💳 Seamless Payments**: Integrated Razorpay for secure and easy course purchases.
-   **📊 Student Dashboard**: Track your purchased courses and learning progress.
-   **🛠 Admin Panel**: Manage lessons, upload videos, and view sales analytics.
-   **🎨 Modern UI/UX**: Fully responsive, dark-themed design with glassmorphism effects and smooth animations.

---

## 🛠 Tech Stack

### Frontend
-   **React.js**: Component-based UI architecture.
-   **Tailwind CSS**: Utility-first styling for a rapid, responsive design.
-   **Framer Motion**: Smooth animations and transitions.
-   **Lucide React**: Beautiful, consistent icons.
-   **Vite**: Blazing fast build tool.

### Backend
-   **Node.js & Express**: Robust and scalable server-side runtime.
-   **MongoDB & Mongoose**: Flexible NoSQL database with schema modeling.
-   **JWT (JSON Web Tokens)**: Secure stateless authentication.
-   **Cloudinary**: Optimization and storage for lesson videos and thumbnails.
-   **Razorpay**: Payment gateway integration.

---

## 📸 Screenshots

| Landing Page | Lesson Catalog |
| :---: | :---: |
| <img src="https://images.unsplash.com/photo-1564186763531-bc6e4e20e8a4?q=80&w=600&auto=format&fit=crop" alt="Landing" width="400" /> | <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop" alt="Catalog" width="400" /> |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
-   Node.js (v16+)
-   MongoDB (Local or Atlas)

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/stringz.git
cd stringz
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd BACKEND
npm install
\`\`\`
Create a \`.env\` file in the \`BACKEND\` directory:
\`\`\`env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:5173
\`\`\`
Start the server:
\`\`\`bash
npm start
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../FRONTEND
npm install
\`\`\`
Create a \`.env\` file in the \`FRONTEND\` directory:
\`\`\`env
VITE_API_URL=http://localhost:4000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_id
\`\`\`
Start the development server:
\`\`\`bash
npm run dev
\`\`\`

---


THANK YOU
