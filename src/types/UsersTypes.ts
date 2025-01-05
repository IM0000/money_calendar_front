export interface UserDto {
  id: number;
  email: string;
  nickname: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
