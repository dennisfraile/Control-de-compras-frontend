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
  Divider,
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
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
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
  { label: 'Precios', path: '/prices', icon: <TrendingUpIcon /> },
  { label: 'Tiendas', path: '/stores', icon: <StoreIcon /> },
];

export default function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const location = useLocation();
  const { data: lowStockItems } = useLowStock();
  const lowStockCount = lowStockItems?.length ?? 0;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavClick = () => {
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
          bgcolor: 'primary.dark',
          color: 'white',
        },
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <ShoppingCartIcon />
          <Typography variant="h6" noWrap fontWeight="bold">
            Control Compras
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={handleNavClick}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
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
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
