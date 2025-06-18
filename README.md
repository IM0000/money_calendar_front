# Money Calendar 프론트엔드 🗓️

> 실적·배당·경제지표 등 금융 이벤트 일정을 확인하고 알림을 제공하는 React SPA

## 🚀 주요 기능

- 금융 이벤트(실적·배당·경제지표) 캘린더 뷰
- 관심 이벤트 즐겨찾기 및 실시간 알림(SSE)
- 기업·티커·경제지표 검색(Debounce 적용)
- 이메일/소셜(OAuth) 로그인
- 모바일 퍼스트 반응형 UI

## 🛠️ 기술 스택

- **Language**: TypeScript
- **Framework**: React + Vite
- **State**: React Query · Zustand
- **Styling**: Tailwind CSS
- **Network**: Axios · SSE
- **Build**: Vite + pnpm

## 📦 설치 및 실행

```bash
git clone <repository-url>
cd vite-project
pnpm install
pnpm dev      # http://localhost:5173
```

## 📁 주요 디렉토리

```
src/
├── api/          # Axios 인스턴스 및 API 헬퍼
├── assets/       # 이미지 등 정적 파일
├── components/   # 재사용 UI 컴포넌트
├── hooks/        # 커스텀 훅
├── pages/        # 라우팅 단위 페이지
├── utils/        # 공통 유틸리티
├── zustand/      # Zustand 스토어
└── types/        # 전역 타입 정의
```

## 🧪 테스트

자동화된 테스트는 아직 없습니다.

## 📄 라이선스

이 프로젝트는 개인 프로젝트입니다.
