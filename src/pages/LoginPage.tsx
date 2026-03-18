import { Navigate } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuthStore } from '../stores/auth.store';

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-20 mx-auto mb-4 rounded-full object-cover"
          />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Mis Compras
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inicia sesion con tu cuenta de Google
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Al iniciar sesion, aceptas nuestros terminos y condiciones.
        </p>
      </div>
    </div>
  );
}
