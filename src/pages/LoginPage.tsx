import { Navigate } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuthStore } from '../stores/auth.store';

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 max-w-md w-full mx-4 text-center animate-fade-in">
        <img
          src="/logo.png"
          alt="FraileDev Logo"
          className="w-20 sm:w-24 mx-auto mb-6"
        />
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Control de Compras
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Inicia sesion con tu cuenta de Google
        </p>

        <GoogleLoginButton />

        <div className="border-t border-gray-200 my-6" />

        <p className="text-xs text-gray-400">
          Al iniciar sesion, aceptas nuestros terminos y condiciones.
        </p>
      </div>
    </div>
  );
}
