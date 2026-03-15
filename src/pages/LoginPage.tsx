import { Box, Card, CardContent, Typography } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
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
      bgcolor="background.default"
    >
      <Card sx={{ maxWidth: 420, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mb={2}
          >
            <ShoppingCartIcon
              sx={{ fontSize: 48, color: 'primary.main' }}
            />
          </Box>
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
            Inicia sesion con tu cuenta de Google para continuar
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
