import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useUIStore } from '../../stores/ui.store';
import { DRAWER_WIDTH } from '../../utils/constants';

export default function AppLayout() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <TopBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: !isMobile && sidebarOpen
            ? `calc(100% - ${DRAWER_WIDTH}px)`
            : '100%',
          ml: !isMobile && sidebarOpen ? 0 : isMobile ? 0 : `-${DRAWER_WIDTH}px`,
          transition: (t) =>
            t.transitions.create(['margin', 'width'], {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.leavingScreen,
            }),
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
