import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import { useAuthStore } from '../stores/auth.store';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <Box>
      <PageHeader title="Mi Perfil" subtitle="Información de tu cuenta" />

      <Card sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'center', sm: 'flex-start' }}
            gap={3}
            mb={3}
          >
            <Avatar
              src={user.pictureUrl}
              alt={user.displayName}
              sx={{ width: 80, height: 80 }}
            />
            <Box textAlign={{ xs: 'center', sm: 'left' }}>
              <Typography variant="h5" fontWeight="bold">
                {user.displayName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider />
        </CardContent>
      </Card>
    </Box>
  );
}
