import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  TrendingDown,
  ChefHat,
  Bell,
  Camera,
  FileText,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useLogout } from '../../hooks/useAuth';
import { useThemeContext } from '../../context/ThemeContext';
import { useLowStock } from '../../hooks/useInventory';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

interface NavGroup {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: NavItem[];
  defaultOpen?: boolean;
}

export default function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['GENERAL', 'COMPRAS', 'INVENTARIO']));
  const profileRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const { theme, toggleTheme } = useThemeContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: lowStockItems } = useLowStock();
  const lowStockCount = lowStockItems?.length ?? 0;

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const isActive = (path: string) => location.pathname === path;

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logoutMutation.mutate();
  };

  const navGroups: NavGroup[] = [
    {
      label: 'GENERAL',
      icon: LayoutDashboard,
      defaultOpen: true,
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      ],
    },
    {
      label: 'COMPRAS',
      icon: ShoppingCart,
      defaultOpen: true,
      items: [
        { label: 'Lista de Compras', path: '/shopping-list', icon: ClipboardList },
        { label: 'Compras', path: '/purchases', icon: ShoppingCart },
        { label: 'Escanear Ticket', path: '/scan-receipt', icon: Camera },
        { label: 'Plantillas', path: '/templates', icon: FileText },
      ],
    },
    {
      label: 'INVENTARIO',
      icon: Warehouse,
      defaultOpen: true,
      items: [
        { label: 'Inventario', path: '/inventory', icon: Warehouse, badge: lowStockCount > 0 ? lowStockCount : undefined },
        { label: 'Productos', path: '/products', icon: Package },
        { label: 'Alertas', path: '/restock-alerts', icon: Bell },
        { label: 'Recetas', path: '/recipes', icon: ChefHat },
      ],
    },
    {
      label: 'ANALISIS',
      icon: TrendingUp,
      items: [
        { label: 'Ahorro', path: '/savings', icon: TrendingDown },
        { label: 'Comparacion', path: '/prices', icon: TrendingUp },
        { label: 'Comunidad', path: '/prices/community', icon: Users },
      ],
    },
    {
      label: 'CONFIGURACION',
      icon: Store,
      items: [
        { label: 'Tiendas', path: '/stores', icon: Store },
      ],
    },
  ];

  const userInitial = (user?.displayName || user?.email || 'U')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-20 transition-colors">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* LEFT: hamburger + logo + title */}
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
              <img src="/logo.png" alt="Mis compras" className="h-8 w-8 rounded-full object-cover" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                Mis compras
              </h1>
            </div>

            {/* RIGHT: theme toggle + user dropdown */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === 'light' ? (
                  <Moon size={20} className="text-gray-600" />
                ) : (
                  <Sun size={20} className="text-gray-300" />
                )}
              </button>

              <button
                onClick={() => navigate('/ayuda')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
                title="Centro de Ayuda"
              >
                <HelpCircle size={20} className="text-gray-600 dark:text-gray-300" />
              </button>

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
                >
                  {user?.pictureUrl ? (
                    <img src={user.pictureUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      {userInitial}
                    </div>
                  )}
                  <span className="text-gray-700 dark:text-gray-300 hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                    {user?.displayName || user?.email}
                  </span>
                  <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
                </button>

                {/* Dropdown menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User size={16} />
                      Mi Perfil
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={16} />
                        Cerrar Sesion
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
          <nav className="px-3 py-4 overflow-y-auto h-full sidebar-scroll">
            {navGroups.map((group) => {
              const GroupIcon = group.icon;
              const isGroupOpen = openGroups.has(group.label);
              const hasActiveItem = group.items.some((item) => isActive(item.path));

              return (
                <div key={group.label} className="mb-2">
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon size={14} className={hasActiveItem ? 'text-blue-500' : ''} />
                      <span className={hasActiveItem ? 'text-blue-600 dark:text-blue-400' : ''}>
                        {group.label}
                      </span>
                    </div>
                    {isGroupOpen ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>

                  {/* Group items */}
                  {isGroupOpen && (
                    <div className="mt-1 space-y-0.5 ml-1">
                      {group.items.map((item) => {
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
                              {item.badge && item.badge > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold text-[10px]">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="whitespace-nowrap text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 transition-all duration-300 p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
