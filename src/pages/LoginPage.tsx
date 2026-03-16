import { Box, Card, CardContent, Typography, Divider } from '@mui/material';
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
        background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #e0e7ff 100%)',
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          mx: 2,
          borderRadius: 4,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
          <Box
            component="img"
            src="/logo.png"
            alt="FraileDev Logo"
            sx={{
              width: { xs: 80, sm: 100 },
              height: 'auto',
              mx: 'auto',
              mb: 3,
              display: 'block',
            }}
          />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Control de Compras
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            mb={4}
          >
            Inicia sesion con tu cuenta de Google
          </Typography>

          <GoogleLoginButton />

          <Divider sx={{ my: 3 }} />

          <Typography variant="caption" color="text.disabled">
            Al iniciar sesion, aceptas nuestros terminos y condiciones.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
