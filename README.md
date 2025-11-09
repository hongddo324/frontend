# 스마트 가계부 포트폴리오 앱 (Community)

현명한 소비 습관을 위한 개인 재정 관리 및 일상 기록 통합 플랫폼

## 📱 프로젝트 소개

스마트 가계부는 단순한 가계부를 넘어 일상 기록, 지출 분석, 예산 관리를 통합한 올인원 재정 관리 앱입니다.

Original Figma Design: https://www.figma.com/design/XAFbgn50qWgA3RF419Ma7I/%EC%8A%A4%EB%A7%88%ED%8A%B8-%EA%B0%80%EA%B3%84%EB%B6%80-%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4-%EC%95%B1--Community-

### 주요 기능

#### 💰 가계부 관리
- **자동 분류**: AI 기반 거래 내역 자동 카테고리 분류
- **실시간 통계**: 카테고리별 지출 현황 및 예산 대비 사용률
- **거래 관리**: 수입/지출 내역 등록, 수정, 삭제
- **검색 기능**: 거래 내역 빠른 검색

#### 📝 일상 기록
- **기분 기록**: 하루의 기분을 이모지로 표현
- **사진 첨부**: 여러 장의 사진과 함께 추억 저장
- **태그 관리**: 카테고리와 태그로 일상 분류
- **소셜 기능**: 좋아요 및 댓글로 커뮤니티 활동

#### 📊 통계 & 분석
- **대시보드**: 한눈에 보는 재정 상태
- **월별 비교**: 이전 달 대비 지출 변화 분석
- **카테고리별 분석**: 각 카테고리의 지출 패턴 파악
- **예측 기능**: 다음 달 지출 예상치 제공
- **일별 추이**: 일별 지출 그래프로 패턴 확인

#### 🔔 알림 & 리포트
- **예산 초과 알림**: 카테고리별 예산 초과 시 실시간 알림
- **일일 리마인더**: 매일 일상 기록 알림
- **주간 리포트**: 주간 지출 요약 자동 생성

#### ⚙️ 설정
- **프로필 관리**: 개인 정보 및 프로필 사진 관리
- **알림 설정**: 각종 알림 on/off
- **개인정보 보호**: 데이터 공유 및 백업 설정
- **테마 변경**: 라이트/다크 모드 지원

## 🛠 기술 스택

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.3.3
- **Build Tool**: Vite 5.4.11
- **UI Library**:
  - Radix UI (Headless UI Components)
  - Tailwind CSS 3.4.17
  - Lucide React (Icons)
- **Charts**: Recharts 2.15.2
- **Form Management**: React Hook Form 7.55.0
- **Date Handling**: date-fns
- **Animations**: Framer Motion (via motion)

### State Management
- React Hooks (useState, useEffect)
- Local State Management

### Styling
- Tailwind CSS
- CSS Custom Properties
- Responsive Design (Mobile-First)

## 📁 프로젝트 구조

```
aaa/
├── src/
│   ├── components/
│   │   ├── ui/              # UI 컴포넌트 (Radix UI 기반)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── AnimatedSection.tsx
│   │   ├── BottomNavigation.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DailyLife.tsx
│   │   ├── ExpenseTracker.tsx
│   │   ├── MonthlyComparison.tsx
│   │   ├── Settings.tsx
│   │   └── Sidebar.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── API_SPECIFICATION.md     # 📄 API 명세서
└── README.md
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 20.x 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
```bash
npm install --ignore-scripts
```

2. **개발 서버 실행**
```bash
npm run dev
```

3. **빌드**
```bash
npm run build
```

4. **프로덕션 미리보기**
```bash
npm run preview
```

### 현재 실행 포트
- 개발 서버: http://localhost:3000 (기본값)
- 자동으로 사용 가능한 포트 찾기 (3000, 3001, 3002...)

## 📡 백엔드 API 연동

현재 프론트엔드는 로컬 state로 작동하며, 실제 백엔드와 연동하려면 API 구현이 필요합니다.

### API 명세서
상세한 API 명세는 다음 파일들을 참조하세요:
- **[API-LIST.md](./API-LIST.md)** - 각 API별 상세 명세 (고유번호, URL, Request/Response Body)
- **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** - 전체 API 개요 및 가이드

### API 엔드포인트 개요

#### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/logout` - 로그아웃
- `PUT /api/auth/password` - 비밀번호 변경

#### 사용자 프로필
- `GET /api/profile` - 프로필 조회
- `PUT /api/profile` - 프로필 수정
- `POST /api/profile/avatar` - 프로필 이미지 업로드

#### 일상 기록
- `GET /api/daily-life` - 일상 목록 조회
- `POST /api/daily-life` - 일상 생성
- `GET /api/daily-life/{id}` - 일상 상세 조회
- `PUT /api/daily-life/{id}` - 일상 수정
- `DELETE /api/daily-life/{id}` - 일상 삭제
- `POST /api/daily-life/{id}/like` - 좋아요 토글
- `POST /api/daily-life/{id}/comments` - 댓글 생성

#### 가계부/거래
- `GET /api/transactions` - 거래 목록 조회
- `POST /api/transactions` - 거래 생성
- `PUT /api/transactions/{id}` - 거래 수정
- `DELETE /api/transactions/{id}` - 거래 삭제
- `GET /api/transactions/statistics/category` - 카테고리별 통계

#### 대시보드
- `GET /api/dashboard/summary` - 대시보드 요약
- `GET /api/notifications` - 알림 목록 조회
- `GET /api/daily-life/recent` - 최근 일상 조회

#### 월별 분석
- `GET /api/analysis/monthly-comparison` - 월별 비교 데이터
- `GET /api/analysis/daily-spending` - 일별 지출 추이
- `GET /api/analysis/card-spending` - 카드사별 결제 금액

#### 설정
- `GET /api/settings/notifications` - 알림 설정 조회
- `PUT /api/settings/notifications` - 알림 설정 수정
- `GET /api/settings/privacy` - 개인정보 설정 조회
- `PUT /api/settings/privacy` - 개인정보 설정 수정

### 인증 방식
모든 API는 JWT 토큰 기반 인증을 사용합니다.

```typescript
// API 요청 예시
const response = await fetch('/api/transactions', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🎨 디자인 시스템

### 색상
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Yellow/Orange (#f59e0b)
- **Danger**: Red (#ef4444)
- **Muted**: Gray (#6b7280)

### 컴포넌트 스타일
- 모든 UI 컴포넌트는 Radix UI와 Tailwind CSS로 구성
- 다크 모드 지원
- 모바일 우선 반응형 디자인

### 레이아웃
- **최대 너비**: 448px (md breakpoint)
- **하단 네비게이션**: 고정 위치
- **패딩**: 16px (p-4)

## 📱 화면 구성

### 1. 대시보드
- 재정 상태 요약
- 알림 센터
- 최근 일상 게시물

### 2. 가계부
- 거래 내역 목록
- 카테고리별 지출 통계
- 도넛 차트 시각화
- 거래 추가/수정/삭제

### 3. 일상 기록
- 일상 목록 (카드 뷰)
- 기분 및 카테고리 필터
- 이미지 캐러셀
- 좋아요 및 댓글 기능

### 4. 월별 분석
- **비교 탭**: 카테고리별 월 대비 비교
- **추이 탭**: 일별/월별 지출 그래프
- **분석 탭**: AI 기반 인사이트 및 개선 권장사항

### 5. 설정
- 프로필 관리
- 알림 설정
- 보안 및 개인정보
- 앱 설정
- 지원

## 🔄 상태 관리 전략

현재는 로컬 state로 관리되며, 실제 프로덕션에서는 다음과 같이 변경 권장:

1. **전역 상태**: Redux Toolkit, Zustand, Recoil
2. **서버 상태**: React Query, SWR
3. **폼 상태**: React Hook Form (이미 사용 중)

## 🧪 향후 개선 사항

### 기능
- [ ] 예산 설정 및 관리 UI
- [ ] 카테고리 커스터마이징
- [ ] 반복 거래 자동 등록
- [ ] 영수증 OCR 스캔
- [ ] 데이터 내보내기 (CSV, Excel)
- [ ] 다중 계좌 관리

### 기술
- [ ] 단위 테스트 (Jest, React Testing Library)
- [ ] E2E 테스트 (Playwright, Cypress)
- [ ] PWA 지원
- [ ] 오프라인 모드
- [ ] 성능 최적화 (코드 스플리팅, 레이지 로딩)

## 🐛 알려진 이슈

1. Windows 환경에서 npm install 시 postinstall 스크립트 에러
   - **해결방법**: `npm install --ignore-scripts` 사용

2. 일부 포트(3000, 3001)가 이미 사용 중일 경우
   - **자동 처리**: Vite가 자동으로 다음 포트 사용

## 📄 라이선스

이 프로젝트는 포트폴리오 목적으로 제작되었습니다.

## 👨‍💻 개발자

- **Email**: support@example.com
- **GitHub**: https://github.com/yourusername

## 🙏 감사의 말

- [Radix UI](https://www.radix-ui.com/) - Headless UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- [Lucide](https://lucide.dev/) - Beautiful Icons
- [Recharts](https://recharts.org/) - Charting Library

---

**Made with ❤️ for better financial management**
