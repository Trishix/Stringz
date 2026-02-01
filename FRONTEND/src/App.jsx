import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1F2937',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
