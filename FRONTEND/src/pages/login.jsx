import { Link, Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import logo from '../assets/images/logo.png';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const Login = () => {
  const { isAuthenticated, loading, googleLogin } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-gray-800/50 p-8 rounded-2xl backdrop-blur-md border border-white/10 relative z-10 shadow-2xl">
        <div className="text-center">
          <img src={logo} alt="Stringz" className="h-12 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
        <LoginForm />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={credentialResponse => {
              googleLogin(credentialResponse.credential)
                .then(() => {
                  toast.success('Login successful!');
                  // Navigation handled by isAuthenticated check
                })
                .catch((err) => {
                  console.error(err);
                  toast.error('Google login failed');
                });
            }}
            onError={() => {
              toast.error('Google login failed');
            }}
            theme="filled_black"
            shape="pill"
            text="signin_with"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
