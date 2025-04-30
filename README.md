# Money Calendar ✨

## 📖 개요

Money Calendar는 실적, 배당, 경제지표 등의 금융 이벤트 일정을 확인하고 관리할 수 있는 React 기반 SPA입니다. 백엔드 API를 통해 금융 이벤트 정보를 가져오고, 사용자에게 실시간 알림을 제공합니다.

## ⚙️ 주요 기능

- **캘린더 뷰**: 실적, 배당, 경제지표 일정을 캘린더 형식으로 확인
- **알림 시스템**: 관심 있는 금융 이벤트에 대한 알림 설정 및 관리 (SSE 기반 실시간 알림)
- **관심 종목/이벤트 관리**: API 연동을 통한 관심 이벤트 추가/삭제 및 조회
- **검색 기능**: 기업, 티커, 경제지표 등 검색 (Debounce 적용)
- **사용자 인증**: 이메일/비밀번호 및 OAuth (Google, Kakao) 로그인/회원가입
- **반응형 UI**: Tailwind CSS를 활용한 모바일 친화적 디자인

## 🛠️ 기술 스택

| 구분          | 기술 및 라이브러리        |
| ------------- | ------------------------- |
| Language      | TypeScript                |
| Library       | React, React Router       |
| State Mng.    | Zustand                   |
| Data Fetch    | React Query, Axios        |
| Styling       | Tailwind CSS              |
| UI Components | Radix UI                  |
| Icons         | Lucide React, React Icons |
| Notifications | React Hot Toast           |
| Bundle        | Vite                      |
| Package Mng.  | pnpm                      |
| Code Style    | ESLint, Prettier          |

## 🚀 설치 및 실행

1. **clone**

   ```bash
   git clone <repository-url>
   cd vite-project
   ```

2. **환경변수 설정 (.env.development)**

   ```
   VITE_API_BASE_URL=/
   VITE_DEBUG=true
   VITE_BACKEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **의존성 설치 & 실행**
   ```bash
   pnpm install
   pnpm dev   # http://localhost:5173 에서 실행
   ```

## 📄 배포

```bash
pnpm build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 🔍 주요 디렉토리 구조

```
src/
├── api/            # API 클라이언트 및 서비스 (Axios 인스턴스, 인터셉터 포함)
├── assets/         # 정적 자산 (이미지 등)
├── components/     # 재사용 가능한 UI 컴포넌트 (Radix UI 기반)
├── hooks/          # 커스텀 훅
├── lib/            # Shadcn UI 관련 유틸리티
├── pages/          # 라우팅 단위 페이지 컴포넌트
├── router.tsx      # React Router 설정
├── types/          # TypeScript 타입 정의
├── utils/          # 유틸리티 함수 (에러 핸들링 등)
└── zustand/        # Zustand 상태 관리 스토어
```

## ✅ 테스트

현재 자동화된 테스트는 구현되어 있지 않습니다.

## ⚡ 성능 최적화 및 특징

- **React Query**: 서버 상태 관리, 데이터 캐싱 및 자동 리프레시
- **메모이제이션**: `useMemo`, `useCallback`을 통한 불필요한 재렌더링 방지
- **Debounce**: 검색 입력 시 불필요한 API 호출 방지
- **Error Handling**: 전역 에러 바운더리 및 API 에러 처리 로직 적용

## 📄 라이선스

GPL © Sangjun Lim
