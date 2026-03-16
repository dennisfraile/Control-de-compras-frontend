import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  ListAlt as ListAltIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Groups as CommunityIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../../stores/ui.store';
import { useLowStock } from '../../hooks/useInventory';
import { DRAWER_WIDTH } from '../../utils/constants';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Productos', path: '/products', icon: <CategoryIcon /> },
  { label: 'Compras', path: '/purchases', icon: <ShoppingCartIcon /> },
  { label: 'Inventario', path: '/inventory', icon: <InventoryIcon /> },
  { label: 'Lista de Compras', path: '/shopping-list', icon: <ListAltIcon /> },
  { label: 'Comparaci\u00f3n', path: '/prices', icon: <TrendingUpIcon /> },
  { label: 'Comunidad', path: '/community-prices', icon: <CommunityIcon /> },
  { label: 'Tiendas', path: '/stores', icon: <StoreIcon /> },
  { label: 'Mi Perfil', path: '/profile', icon: <PersonIcon /> },
];

export default function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: lowStockItems } = useLowStock();
  const lowStockCount = lowStockItems?.length ?? 0;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={sidebarOpen}
      onClose={isMobile ? toggleSidebar : undefined}
      sx={{
        width: sidebarOpen && !isMobile ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            component="img"
            src="/logo.png"
            alt="FraileDev"
            sx={{ width: 32, height: 32 }}
          />
          <Typography
            variant="h6"
            noWrap
            fontWeight={700}
            color="text.primary"
          >
            Control de Compras
          </Typography>
        </Box>
      </Toolbar>

      <List sx={{ px: 1, mt: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                onClick={() => handleNavClick(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isActive
                      ? 'primary.dark'
                      : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.path === '/inventory' && lowStockCount > 0 ? (
                    <Badge badgeContent={lowStockCount} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '0.9rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
