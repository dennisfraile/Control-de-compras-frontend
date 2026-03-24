import { useState, useEffect, useCallback } from 'react';
import { Bell, X, AlertTriangle, Package, ShoppingCart, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLowStock } from '../../hooks/useInventory';

interface Notification {
  id: string;
  type: 'lowStock' | 'expiring' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data: lowStockItems } = useLowStock();

  // Generate notifications from low stock data
  useEffect(() => {
    if (!lowStockItems) return;

    const newNotifications: Notification[] = [];

    if (lowStockItems.length > 0) {
      newNotifications.push({
        id: 'low-stock-alert',
        type: 'lowStock',
        title: 'Productos con stock bajo',
        message: `${lowStockItems.length} producto${lowStockItems.length > 1 ? 's' : ''} por acabarse: ${lowStockItems.slice(0, 3).map((i: any) => i.productName || i.product?.name || 'Producto').join(', ')}`,
        timestamp: new Date(),
        read: false,
      });
    }

    // Check for expiring items (mock - would come from API)
    const expiringCount = lowStockItems.filter((i: any) => {
      if (!i.expirationDateUtc) return false;
      const daysUntil = (new Date(i.expirationDateUtc).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntil <= 7 && daysUntil > 0;
    }).length;

    if (expiringCount > 0) {
      newNotifications.push({
        id: 'expiring-alert',
        type: 'expiring',
        title: 'Productos por vencer',
        message: `${expiringCount} producto${expiringCount > 1 ? 's' : ''} vence${expiringCount > 1 ? 'n' : ''} en los proximos 7 dias`,
        timestamp: new Date(),
        read: false,
      });
    }

    setNotifications(newNotifications);
  }, [lowStockItems]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'lowStock':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'expiring':
        return <Clock size={16} className="text-red-500" />;
      case 'reminder':
        return <ShoppingCart size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) markAllRead();
        }}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Notificaciones"
      >
        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  Notificaciones
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell size={24} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No hay notificaciones
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(notif.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                        <button
                          onClick={() => dismiss(notif.id)}
                          className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
