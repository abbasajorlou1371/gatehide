export interface UserSession {
  id: number;
  user_id: number;
  user_type: string;
  device_info?: string;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
  last_activity_at: string;
  created_at: string;
  expires_at: string;
  is_current: boolean;
}

export interface SessionsResponse {
  message: string;
  sessions: UserSession[];
  count: number;
}

export interface LogoutSessionResponse {
  message: string;
}

export interface LogoutAllOthersResponse {
  message: string;
}

export interface LogoutAllResponse {
  message: string;
}
