import { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider } from 'notistack';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'dayjs/locale/es';
import { getTheme } from './theme';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import router from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AppInner() {
  const { theme } = useThemeContext();
  const muiTheme = useMemo(() => getTheme(theme === 'dark' ? 'dark' : 'light'), [theme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={3000}
        >
          <RouterProvider router={router} />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme={theme}
          />
        </SnackbarProvider>
      </LocalizationProvider>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppInner />
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
