import { useState, useEffect, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
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
import { useUIStore } from '../../stores/ui.store';
import { useAuthStore } from '../../stores/auth.store';
import { useLogout } from '../../hooks/useAuth';
import { useThemeContext } from '../../context/ThemeContext';
import { useLowStock } from '../../hooks/useInventory';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
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
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const { theme, toggleTheme } = useThemeContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: lowStockItems } = useLowStock();
  const lowStockCount = lowStockItems?.length ?? 0;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen && !isMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-gray-800 dark:text-white hidden sm:inline">
            Control de Compras
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {user && (
            <span className="text-gray-700 dark:text-gray-200 font-medium text-sm hidden sm:inline">
              {user.displayName}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] z-40 overflow-y-auto
          bg-white border-r border-gray-200
          dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800 dark:border-gray-700
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-sm font-medium transition-all
                  ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }
                `}
                style={{ width: 'calc(100% - 1rem)' }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.path === '/inventory' && lowStockCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {lowStockCount}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-300 p-6 ${
          sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
