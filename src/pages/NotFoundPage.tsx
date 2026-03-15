import { Box, Typography, Button } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={3}
      p={4}
    >
      <Typography variant="h1" fontWeight="bold" color="text.disabled">
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Pagina no encontrada
      </Typography>
      <Typography variant="body1" color="text.disabled" textAlign="center">
        La pagina que buscas no existe o ha sido movida.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/')}
        size="large"
      >
        Ir al Inicio
      </Button>
    </Box>
  );
}
