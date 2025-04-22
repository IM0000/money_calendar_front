export interface UserDto {
  id: number;
  email: string;
  nickname: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasPassword?: boolean;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  nickname: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: boolean;
  oauthConnections: OAuthConnection[];
}

export interface OAuthConnection {
  provider: string;
  connected: boolean;
  oauthEmail?: string;
}
