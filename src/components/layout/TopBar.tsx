import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
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
        bgcolor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleSidebar}
          sx={{ mr: isMobile ? 1 : 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
          {user && (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              onClick={() => navigate('/profile')}
              sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
            >
              <Avatar
                src={user.pictureUrl}
                alt={user.displayName}
                sx={{ width: 32, height: 32 }}
              />
              {!isXs && (
                <Typography variant="body2" fontWeight={500}>
                  {user.displayName}
                </Typography>
              )}
            </Box>
          )}
          <Button
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            size="small"
            color="inherit"
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
