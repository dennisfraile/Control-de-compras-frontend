export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface GoogleLoginRequest {
  credential: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
