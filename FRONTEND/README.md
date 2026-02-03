# Stringz - Frontend

A premium guitar learning platform connecting students with world-class instructors.

## 🚀 Features

- **Course Catalog**: Browse and filter guitar lessons by difficulty and genre.
- **Video Learning**: HD video player for purchased lessons.
- **User Authentication**: Secure Login/Signup with Email & Google Auth.
- **Student Dashboard**: Track purchased courses and progress.
- **Admin Dashboard**: Manage lessons, view sales stats, and user management.
- **Responsive Design**: Mobile-first, beautiful UI with dark mode aesthetics.

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS 4 + Framer Motion (Transitions)
- **Icons**: Lucide React
- **State Management**: Context API
- **Routing**: React Router DOM 7
- **Forms**: React Hook Form
- **Testing**: Vitest + React Testing Library

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FRONTEND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run unit and component tests:
```bash
npm test
```

## 🏗 Build for Production

To create an optimized production build:
```bash
npm run build
```
Preview the build locally:
```bash
npm run preview
```

## 📂 Project Structure

- `src/components`: Reusable UI components (buttons, forms, layout).
- `src/pages`: Page components (Home, Dashboard, etc.).
- `src/context`: React Context providers (AuthContext).
- `src/services`: API service modules.
- `src/constants`: Configuration and global constants.
- `src/hooks`: Custom React hooks.
- `src/utils`: Helper functions.

## ⚠️ Known Issues / Manual Actions

- **Favicon**: A resized 64x64 favicon is provided at `/favicon.png`. The original source image was 2MB and should be replaced if higher resolution is needed (but optimized).
- **Icons**: `react-icons` was removed in favor of `lucide-react`.
- **Google Auth**: Requires a valid Client ID in `.env`.
