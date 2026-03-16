import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Button,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { useUIStore } from '../../stores/ui.store';
import { useLogout } from '../../hooks/useAuth';
import { DRAWER_WIDTH } from '../../utils/constants';

export default function TopBar() {
  const user = useAuthStore((state) => state.user);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const themeMode = useUIStore((state) => state.themeMode);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: !isMobile && sidebarOpen
          ? `calc(100% - ${DRAWER_WIDTH}px)`
          : '100%',
        ml: !isMobile && sidebarOpen ? `${DRAWER_WIDTH}px` : 0,
        transition: (t) =>
          t.transitions.create(['margin', 'width'], {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.leavingScreen,
          }),
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleSidebar}
        >
          {sidebarOpen && !isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* Logo + App name on mobile when sidebar is closed */}
        {(isMobile || !sidebarOpen) && (
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              component="img"
              src="/logo.png"
              alt="Logo"
              sx={{ width: 28, height: 28 }}
            />
            {!isXs && (
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                Control de Compras
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" alignItems="center" gap={0.5}>
          <Tooltip title="Notificaciones">
            <IconButton color="inherit" size="small">
              <NotificationsIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={themeMode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
            <IconButton color="inherit" size="small" onClick={toggleTheme}>
              {themeMode === 'light' ? (
                <DarkModeIcon fontSize="small" />
              ) : (
                <LightModeIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {user && (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              onClick={() => navigate('/profile')}
              sx={{
                cursor: 'pointer',
                ml: 1,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Avatar
                src={user.pictureUrl}
                alt={user.displayName}
                sx={{ width: 30, height: 30, fontSize: 14 }}
              >
                {user.displayName?.charAt(0)}
              </Avatar>
              {!isXs && (
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user.displayName}
                </Typography>
              )}
            </Box>
          )}

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            size="small"
            sx={{
              ml: 1,
              borderRadius: 20,
              px: 2,
              fontSize: '0.8rem',
            }}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
