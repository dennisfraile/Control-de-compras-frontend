import PageHeader from '../components/common/PageHeader';
import { useAuthStore } from '../stores/auth.store';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader title="Mi perfil" helpKey="profile" subtitle="Informacion de tu cuenta" />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-lg mx-auto text-center animate-fade-in">
        {user.pictureUrl ? (
          <img
            src={user.pictureUrl}
            alt={user.displayName}
            className="w-24 h-24 rounded-full mx-auto border-4 border-blue-100 dark:border-blue-900 object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto border-4 border-blue-100 dark:border-blue-900 bg-blue-500 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user.displayName?.charAt(0) ?? '?'}
            </span>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4">
          {user.displayName}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {user.email}
        </p>

        <div className="border-t border-gray-200 dark:border-gray-700 my-6" />

        <div className="text-left space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              ID de usuario
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-mono">
              {user.id}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
