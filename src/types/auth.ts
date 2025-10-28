export interface User {
  id: number;
  name: string;
  mobile: string;
  email: string;
  image?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  permissions?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user_type: 'user' | 'admin' | 'gamenet';
  user: User;
  expires_at: string;
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  userType: 'user' | 'admin' | 'gamenet' | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: User) => void;
  updatePermissions: (permissions: string[]) => void;
}
