import { Box, Card, CardContent, Typography } from '@mui/material';
import { Navigate } from 'react-router-dom';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';
import { useAuthStore } from '../stores/auth.store';

export default function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        bgcolor: '#1a1a2e',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          mx: 2,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
          <Box
            component="img"
            src="/logo.png"
            alt="FraileDev Logo"
            sx={{
              width: { xs: 120, sm: 150 },
              height: 'auto',
              mx: 'auto',
              mb: 2,
              display: 'block',
            }}
          />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Control de Compras
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={4}
          >
            Administra tus compras, inventario y presupuesto de forma
            inteligente.
          </Typography>
          <GoogleLoginButton />
          <Typography variant="caption" color="text.disabled" mt={3} display="block">
            Inicia sesión con tu cuenta de Google para continuar
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
