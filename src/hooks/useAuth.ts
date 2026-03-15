import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import { GoogleLoginRequest } from '../types/auth.types';

export function useGoogleLogin() {
  const { login } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: GoogleLoginRequest) => authApi.googleLogin(data),
    onSuccess: (response) => {
      login(response.accessToken, response.refreshToken, response.user);
      enqueueSnackbar('Inicio de sesion exitoso', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al iniciar sesion', { variant: 'error' });
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      enqueueSnackbar('Sesion cerrada', { variant: 'info' });
    },
    onError: () => {
      logout();
    },
  });
}
