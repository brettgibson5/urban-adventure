export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  cityId: string;
  friends: string[]; // Array of user IDs
  profile?: {
    avatar?: string;
    bio?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  email: string;
  password: string;
  username: string;
  cityId: string; // Required during signup
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string; // If implementing refresh token functionality
  user: Omit<User, 'friends'> & {
    // Exclude sensitive data in response
    friendCount: number; // Send count instead of full array
  };
  expiresIn: number; // Token expiration time in seconds
}

// Additional helper types
export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Custom error types for authentication
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_IN_USE = 'EMAIL_IN_USE',
  USERNAME_IN_USE = 'USERNAME_IN_USE',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
  field?: string; // Specific field that caused the error
}
