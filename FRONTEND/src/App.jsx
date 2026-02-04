import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CONFIG } from './constants/config';

import ScrollToTop from './components/common/ScrollToTop';

function App() {

  return (
    <BrowserRouter>
      <ScrollToTop />
      <GoogleOAuthProvider clientId={CONFIG.GOOGLE_CLIENT_ID}>
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
