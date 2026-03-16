import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  ClipboardList,
  TrendingUp,
  Users,
  Store,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useLogout } from '../../hooks/useAuth';
import { useThemeContext } from '../../context/ThemeContext';
import { useLowStock } from '../../hooks/useInventory';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const menuItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Productos', path: '/products', icon: Package },
  { label: 'Compras', path: '/purchases', icon: ShoppingCart },
  { label: 'Inventario', path: '/inventory', icon: Warehouse },
  { label: 'Lista de Compras', path: '/shopping-list', icon: ClipboardList },
  { label: 'Comparacion', path: '/prices', icon: TrendingUp },
  { label: 'Comunidad', path: '/prices/community', icon: Users },
  { label: 'Tiendas', path: '/stores', icon: Store },
  { label: 'Mi Perfil', path: '/profile', icon: User },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const { theme, toggleTheme } = useThemeContext();
  const location = useLocation();
  const { data: lowStockItems } = useLowStock();
  const lowStockCount = lowStockItems?.length ?? 0;

  // Cerrar sidebar al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-20 transition-colors">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* IZQUIERDA: hamburguesa + logo + titulo */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:mr-2"
              >
                {sidebarOpen ? (
                  <X size={24} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu size={24} className="text-gray-600 dark:text-gray-300" />
                )}
              </button>
              <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Mis Compras
              </h1>
            </div>

            {/* DERECHA: theme toggle + user + logout */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun size={20} className="text-gray-300" />
                )}
              </button>
              <span className="text-gray-600 dark:text-gray-300 hidden sm:inline text-sm">
                {user?.displayName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex relative">
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-16 bg-black/50 z-30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-16 left-0 h-[calc(100vh-4rem)] w-64
            bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800
            border-r border-gray-200 dark:border-slate-700/50
            shadow-lg dark:shadow-none
            transition-transform duration-300 ease-in-out
            z-40
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="px-3 py-4 space-y-1 overflow-y-auto h-full sidebar-scroll">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <div className="relative shrink-0">
                    <Icon size={20} className={active ? 'text-white' : ''} />
                    {item.path === '/inventory' && lowStockCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold text-[10px]">
                        {lowStockCount}
                      </span>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 transition-all duration-300 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
