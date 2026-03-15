import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useGoogleLogin } from '../../hooks/useAuth';

export default function GoogleLoginButton() {
  const navigate = useNavigate();
  const loginMutation = useGoogleLogin();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      loginMutation.mutate(
        { credential: credentialResponse.credential },
        {
          onSuccess: () => {
            navigate('/', { replace: true });
          },
        },
      );
    }
  };

  const handleError = () => {
    console.error('Google login failed');
  };

  return (
    <Box display="flex" justifyContent="center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        size="large"
        theme="outline"
        text="signin_with"
        shape="rectangular"
        locale="es"
      />
    </Box>
  );
}
