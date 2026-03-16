import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-100 text-red-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
      <WifiOff size={20} />
      <div>
        <p className="font-semibold text-sm">Sin conexion</p>
        <p className="text-xs">Algunas funciones no estan disponibles</p>
      </div>
    </div>
  );
}
