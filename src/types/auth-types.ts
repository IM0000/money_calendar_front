// src/types/authTypes.ts

// 회원가입 요청 데이터
export interface RegisterDto {
  email: string;
}

// 인증 코드 검증 및 비밀번호 설정 요청 데이터
export interface VerifyDto {
  email: string;
  code: string;
}

// 로그인 요청 데이터
export interface LoginDto {
  email: string;
  password: string;
}

// 로그인 응답 데이터
export interface LoginResponse {
  user: {
    id: number;
    email: string;
    nickname: string | null;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    // 필요에 따라 다른 사용자 필드 추가
  };
}
