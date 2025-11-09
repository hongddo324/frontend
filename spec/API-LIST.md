# API 명세서 (API Specification List)

## 목차
- [1. 인증 (Authentication)](#1-인증-authentication)
- [2. 사용자 프로필 (User Profile)](#2-사용자-프로필-user-profile)
- [3. 일상 기록 (Daily Life)](#3-일상-기록-daily-life)
- [4. 가계부/거래 (Transactions)](#4-가계부거래-transactions)
- [5. 대시보드 (Dashboard)](#5-대시보드-dashboard)
- [6. 월별 분석 (Monthly Comparison)](#6-월별-분석-monthly-comparison)
- [7. 설정 (Settings)](#7-설정-settings)
- [8. 일정 (Schedule)](#8-일정-schedule)

---

## 1. 인증 (Authentication)

### API-001: 로그인

**API ID**: `API-001`

**Method**: `POST`

**URL**: `/api/auth/login`

**Description**: 사용자 로그인

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | 사용자 이메일 |
| password | string | Yes | 비밀번호 (최소 8자) |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "김가계",
      "email": "user@example.com",
      "avatar": "https://storage.example.com/avatars/user1.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzMjE1..."
  }
}
```

**Response Fields**:
| Field | Type | Description |
|-------|------|-------------|
| success | boolean | 성공 여부 |
| data.user.id | number | 사용자 ID |
| data.user.name | string | 사용자 이름 |
| data.user.email | string | 사용자 이메일 |
| data.user.avatar | string | 프로필 이미지 URL |
| data.token | string | JWT 인증 토큰 |

**Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
  }
}
```

---

### API-002: 회원가입

**API ID**: `API-002`

**Method**: `POST`

**URL**: `/api/auth/register`

**Description**: 신규 사용자 회원가입

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "김가계",
  "email": "user@example.com",
  "password": "password123",
  "phone": "010-1234-5678"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | 사용자 이름 (2-20자) |
| email | string | Yes | 이메일 주소 (유효한 이메일 형식) |
| password | string | Yes | 비밀번호 (최소 8자, 영문+숫자 조합) |
| phone | string | Yes | 전화번호 (010-XXXX-XXXX 형식) |

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "김가계",
      "email": "user@example.com",
      "phone": "010-1234-5678"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "이미 사용 중인 이메일입니다."
  }
}
```

---

### API-003: 로그아웃

**API ID**: `API-003`

**Method**: `POST`

**URL**: `/api/auth/logout`

**Description**: 사용자 로그아웃 및 토큰 무효화

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "로그아웃되었습니다."
}
```

---

### API-004: 비밀번호 변경

**API ID**: `API-004`

**Method**: `PUT`

**URL**: `/api/auth/password`

**Description**: 비밀번호 변경

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| currentPassword | string | Yes | 현재 비밀번호 |
| newPassword | string | Yes | 새 비밀번호 (최소 8자) |

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다."
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "현재 비밀번호가 올바르지 않습니다."
  }
}
```

---

## 2. 사용자 프로필 (User Profile)

### API-005: 프로필 조회

**API ID**: `API-005`

**Method**: `GET`

**URL**: `/api/profile`

**Description**: 사용자 프로필 정보 조회

**Request Headers**:
```
Authorization: Bearer {token}
```

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "김가계",
    "email": "user@example.com",
    "phone": "010-1234-5678",
    "avatar": "https://storage.example.com/avatars/user1.jpg",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-08-14T10:30:00Z"
  }
}
```

---

### API-006: 프로필 수정

**API ID**: `API-006`

**Method**: `PUT`

**URL**: `/api/profile`

**Description**: 사용자 프로필 정보 수정

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "김가계",
  "email": "newemail@example.com",
  "phone": "010-9876-5432"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | 사용자 이름 |
| email | string | No | 이메일 주소 |
| phone | string | No | 전화번호 |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "김가계",
    "email": "newemail@example.com",
    "phone": "010-9876-5432",
    "avatar": "https://storage.example.com/avatars/user1.jpg"
  }
}
```

---

### API-007: 프로필 이미지 업로드

**API ID**: `API-007`

**Method**: `POST`

**URL**: `/api/profile/avatar`

**Description**: 프로필 이미지 업로드

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body** (FormData):
```
avatar: [File]
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| avatar | File | Yes | 이미지 파일 (JPG, PNG, 최대 10MB) |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://storage.example.com/avatars/user1_20250814.jpg"
  }
}
```

---

## 3. 일상 기록 (Daily Life)

### API-008: 일상 목록 조회

**API ID**: `API-008`

**Method**: `GET`

**URL**: `/api/daily-life`

**Description**: 일상 기록 목록 조회 (페이지네이션)

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | 페이지 번호 (기본값: 1) |
| limit | number | No | 페이지당 항목 수 (기본값: 20, 최대: 100) |
| category | string | No | 카테고리 필터 (일상, 취미, 여행 등) |
| mood | string | No | 기분 필터 (good, neutral, bad) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": 1,
        "date": "2025-08-14",
        "title": "카페에서의 여유",
        "content": "오랜만에 친구와 카페에서 수다를 떨었다. 집에서 만든 커피도 좋지만, 가끔은 이런 여유도 필요하다는 걸 느꼈다.",
        "mood": "good",
        "category": "일상",
        "tags": ["카페", "친구", "휴식"],
        "images": [
          "https://storage.example.com/daily-life/1_img1.jpg"
        ],
        "likes": 12,
        "liked": false,
        "commentsCount": 2,
        "createdAt": "2025-08-14T10:30:00Z",
        "updatedAt": "2025-08-14T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

---

### API-009: 일상 생성

**API ID**: `API-009`

**Method**: `POST`

**URL**: `/api/daily-life`

**Description**: 새로운 일상 기록 생성

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body** (FormData):
```
title: "카페에서의 여유"
content: "오랜만에 친구와 카페에서 수다를 떨었다..."
mood: "good"
category: "일상"
tags: "카페,친구,휴식"
images: [File, File]
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | 제목 (최대 100자) |
| content | string | Yes | 내용 (최대 5000자) |
| mood | string | Yes | 기분 (good, neutral, bad) |
| category | string | Yes | 카테고리 |
| tags | string | No | 태그 (쉼표로 구분) |
| images | File[] | No | 이미지 파일들 (최대 5개, 각 10MB) |

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2025-08-14",
    "title": "카페에서의 여유",
    "content": "오랜만에 친구와 카페에서 수다를 떨었다...",
    "mood": "good",
    "category": "일상",
    "tags": ["카페", "친구", "휴식"],
    "images": [
      "https://storage.example.com/daily-life/1_img1.jpg"
    ],
    "likes": 0,
    "liked": false,
    "comments": [],
    "createdAt": "2025-08-14T10:30:00Z"
  }
}
```

---

### API-010: 일상 상세 조회

**API ID**: `API-010`

**Method**: `GET`

**URL**: `/api/daily-life/{id}`

**Description**: 특정 일상 기록 상세 조회

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일상 기록 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "date": "2025-08-14",
    "title": "카페에서의 여유",
    "content": "오랜만에 친구와 카페에서 수다를 떨었다...",
    "mood": "good",
    "category": "일상",
    "tags": ["카페", "친구", "휴식"],
    "images": [
      "https://storage.example.com/daily-life/1_img1.jpg"
    ],
    "likes": 12,
    "liked": false,
    "comments": [
      {
        "id": 1,
        "author": "김민지",
        "authorId": 2,
        "content": "좋은 시간 보내셨네요! 저도 가끔 그런 여유가 필요해요 😊",
        "date": "2025-08-14",
        "avatar": "https://storage.example.com/avatars/user2.jpg",
        "createdAt": "2025-08-14T11:00:00Z"
      }
    ],
    "createdAt": "2025-08-14T10:30:00Z",
    "updatedAt": "2025-08-14T10:30:00Z"
  }
}
```

---

### API-011: 일상 수정

**API ID**: `API-011`

**Method**: `PUT`

**URL**: `/api/daily-life/{id}`

**Description**: 일상 기록 수정

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일상 기록 ID |

**Request Body** (FormData):
```
title: "카페에서의 여유 (수정)"
content: "내용 수정..."
mood: "good"
category: "일상"
tags: "카페,친구"
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "카페에서의 여유 (수정)",
    "content": "내용 수정...",
    "mood": "good",
    "category": "일상",
    "tags": ["카페", "친구"],
    "updatedAt": "2025-08-14T15:00:00Z"
  }
}
```

---

### API-012: 일상 삭제

**API ID**: `API-012`

**Method**: `DELETE`

**URL**: `/api/daily-life/{id}`

**Description**: 일상 기록 삭제

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일상 기록 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "일상이 삭제되었습니다."
}
```

---

### API-013: 좋아요 토글

**API ID**: `API-013`

**Method**: `POST`

**URL**: `/api/daily-life/{id}/like`

**Description**: 일상 기록 좋아요 추가/취소

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일상 기록 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likes": 13
  }
}
```

---

### API-014: 댓글 생성

**API ID**: `API-014`

**Method**: `POST`

**URL**: `/api/daily-life/{id}/comments`

**Description**: 일상 기록에 댓글 작성

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일상 기록 ID |

**Request Body**:
```json
{
  "content": "좋은 글이네요!"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | string | Yes | 댓글 내용 (최대 500자) |

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "author": "김가계",
    "authorId": 1,
    "content": "좋은 글이네요!",
    "date": "2025-08-14",
    "avatar": "https://storage.example.com/avatars/user1.jpg",
    "createdAt": "2025-08-14T16:00:00Z"
  }
}
```

---

### API-015: 댓글 삭제

**API ID**: `API-015`

**Method**: `DELETE`

**URL**: `/api/daily-life/{entryId}/comments/{commentId}`

**Description**: 댓글 삭제

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| entryId | number | Yes | 일상 기록 ID |
| commentId | number | Yes | 댓글 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "댓글이 삭제되었습니다."
}
```

---

## 4. 가계부/거래 (Transactions)

### API-016: 거래 목록 조회

**API ID**: `API-016`

**Method**: `GET`

**URL**: `/api/transactions`

**Description**: 거래 내역 목록 조회 (페이지네이션 및 필터)

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | 페이지 번호 (기본값: 1) |
| limit | number | No | 페이지당 항목 수 (기본값: 20) |
| type | string | No | 거래 유형 (income, expense) |
| category | string | No | 카테고리 필터 |
| startDate | string | No | 시작 날짜 (YYYY-MM-DD) |
| endDate | string | No | 종료 날짜 (YYYY-MM-DD) |
| search | string | No | 검색어 (거래 내용) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "description": "스타벅스 커피",
        "amount": 6500,
        "category": "식비",
        "date": "2025-08-14",
        "type": "expense",
        "isAutoClassified": true,
        "createdAt": "2025-08-14T09:00:00Z"
      },
      {
        "id": 2,
        "description": "급여",
        "amount": 2800000,
        "category": "급여",
        "date": "2025-08-01",
        "type": "income",
        "isAutoClassified": false,
        "createdAt": "2025-08-01T00:00:00Z"
      }
    ],
    "summary": {
      "totalIncome": 2800000,
      "totalExpense": 1300000,
      "balance": 1500000
    },
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    }
  }
}
```

---

### API-017: 거래 생성

**API ID**: `API-017`

**Method**: `POST`

**URL**: `/api/transactions`

**Description**: 새로운 거래 내역 등록

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "description": "스타벅스 커피",
  "amount": 6500,
  "category": "식비",
  "type": "expense",
  "date": "2025-08-14"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| description | string | Yes | 거래 내용 (최대 200자) |
| amount | number | Yes | 금액 (양수) |
| category | string | No | 카테고리 (비워두면 자동 분류) |
| type | string | Yes | 거래 유형 (income, expense) |
| date | string | Yes | 거래 날짜 (YYYY-MM-DD) |

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "description": "스타벅스 커피",
    "amount": 6500,
    "category": "식비",
    "date": "2025-08-14",
    "type": "expense",
    "isAutoClassified": true,
    "createdAt": "2025-08-14T09:00:00Z"
  }
}
```

---

### API-018: 거래 수정

**API ID**: `API-018`

**Method**: `PUT`

**URL**: `/api/transactions/{id}`

**Description**: 거래 내역 수정

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 거래 ID |

**Request Body**:
```json
{
  "description": "스타벅스 커피 (수정)",
  "amount": 7000,
  "category": "식비",
  "type": "expense",
  "date": "2025-08-14"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| description | string | No | 거래 내용 |
| amount | number | No | 금액 |
| category | string | No | 카테고리 |
| type | string | No | 거래 유형 |
| date | string | No | 거래 날짜 |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "description": "스타벅스 커피 (수정)",
    "amount": 7000,
    "category": "식비",
    "type": "expense",
    "date": "2025-08-14",
    "updatedAt": "2025-08-14T15:30:00Z"
  }
}
```

---

### API-019: 거래 삭제

**API ID**: `API-019`

**Method**: `DELETE`

**URL**: `/api/transactions/{id}`

**Description**: 거래 내역 삭제

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 거래 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "거래가 삭제되었습니다."
}
```

---

### API-020: 카테고리별 통계

**API ID**: `API-020`

**Method**: `GET`

**URL**: `/api/transactions/statistics/category`

**Description**: 카테고리별 지출/수입 통계

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| month | string | No | 조회 월 (YYYY-MM, 기본값: 현재 월) |
| type | string | No | 거래 유형 (income, expense) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "name": "식비",
        "spent": 420000,
        "budget": 500000,
        "percentage": 84,
        "color": "#3b82f6",
        "transactionCount": 45
      },
      {
        "name": "교통비",
        "spent": 180000,
        "budget": 200000,
        "percentage": 90,
        "color": "#10b981",
        "transactionCount": 28
      }
    ],
    "total": {
      "spent": 1284000,
      "budget": 1450000,
      "percentage": 88.6
    }
  }
}
```

---

## 5. 대시보드 (Dashboard)

### API-021: 대시보드 요약 데이터

**API ID**: `API-021`

**Method**: `GET`

**URL**: `/api/dashboard/summary`

**Description**: 대시보드 요약 통계 조회

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| month | string | No | 조회 월 (YYYY-MM) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "quickStats": {
      "monthlyIncome": {
        "value": 2800000,
        "change": 12.5,
        "trend": "up"
      },
      "monthlyExpense": {
        "value": 1300000,
        "change": -8.2,
        "trend": "down"
      },
      "balance": {
        "value": 1500000,
        "change": 20.3,
        "trend": "up"
      },
      "savingsRate": {
        "value": 54.1,
        "change": 5.1,
        "trend": "up"
      }
    },
    "financialHealth": "healthy"
  }
}
```

---

### API-022: 알림 목록 조회

**API ID**: `API-022`

**Method**: `GET`

**URL**: `/api/notifications`

**Description**: 사용자 알림 목록 조회

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| unreadOnly | boolean | No | 읽지 않은 알림만 조회 |
| limit | number | No | 조회 개수 제한 |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "title": "쇼핑 예산 초과",
        "message": "쇼핑 카테고리가 예산의 106.7%를 사용했습니다.",
        "type": "warning",
        "time": "2시간 전",
        "icon": "⚠️",
        "read": false,
        "createdAt": "2025-08-14T08:00:00Z"
      },
      {
        "id": 2,
        "title": "저축 목표 달성!",
        "message": "이번 달 저축률 목표 50%를 달성했습니다!",
        "type": "success",
        "time": "5시간 전",
        "icon": "🎉",
        "read": false,
        "createdAt": "2025-08-14T05:00:00Z"
      }
    ],
    "unreadCount": 3
  }
}
```

---

### API-023: 알림 읽음 처리

**API ID**: `API-023`

**Method**: `PUT`

**URL**: `/api/notifications/{id}/read`

**Description**: 특정 알림을 읽음으로 표시

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 알림 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "알림이 읽음 처리되었습니다."
}
```

---

### API-024: 최근 일상 게시물

**API ID**: `API-024`

**Method**: `GET`

**URL**: `/api/daily-life/recent`

**Description**: 대시보드용 최근 일상 게시물 조회

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | 조회 개수 (기본값: 5) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "카페에서의 여유",
        "content": "오랜만에 친구와 카페에서 수다를 떨었다...",
        "category": "일상",
        "date": "08.14",
        "mood": "😊"
      },
      {
        "id": 2,
        "title": "재택근무 하루",
        "content": "집에서 일하니 출퇴근 스트레스가 없어서 좋다...",
        "category": "일상",
        "date": "08.13",
        "mood": "😊"
      }
    ]
  }
}
```

---

## 6. 월별 분석 (Monthly Comparison)

### API-025: 월별 비교 데이터

**API ID**: `API-025`

**Method**: `GET`

**URL**: `/api/analysis/monthly-comparison`

**Description**: 월별 지출 비교 및 예측 데이터

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| currentMonth | string | No | 현재 월 (YYYY-MM) |
| compareMonths | number | No | 비교 개월 수 (기본값: 3) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "monthlyData": [
      {
        "month": "6월",
        "식비": 380000,
        "교통비": 120000,
        "쇼핑": 250000,
        "문화생활": 180000,
        "기타": 150000
      },
      {
        "month": "7월",
        "식비": 420000,
        "교통비": 160000,
        "쇼핑": 320000,
        "문화생활": 200000,
        "기타": 180000
      },
      {
        "month": "8월",
        "식비": 420000,
        "교통비": 180000,
        "쇼핑": 320000,
        "문화생활": 150000,
        "기타": 214000
      }
    ],
    "categoryComparison": [
      {
        "category": "식비",
        "current": 420000,
        "predicted": 350000,
        "budget": 500000,
        "trend": "down",
        "change": -16.7
      }
    ],
    "totalCurrent": 1284000,
    "totalPredicted": 1120000,
    "totalBudget": 1450000
  }
}
```

---

### API-026: 일별 지출 추이

**API ID**: `API-026`

**Method**: `GET`

**URL**: `/api/analysis/daily-spending`

**Description**: 특정 월의 일별 지출 추이

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| month | string | Yes | 조회 월 (YYYY-MM) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "dailySpending": [
      {
        "day": 1,
        "amount": 45000,
        "date": "2025-08-01"
      },
      {
        "day": 2,
        "amount": 32000,
        "date": "2025-08-02"
      },
      {
        "day": 3,
        "amount": 67000,
        "date": "2025-08-03"
      }
    ],
    "average": 48571,
    "total": 680000,
    "highestDay": {
      "day": 5,
      "amount": 89000
    },
    "lowestDay": {
      "day": 4,
      "amount": 28000
    }
  }
}
```

---

### API-027: 카드사별 결제 금액

**API ID**: `API-027`

**Method**: `GET`

**URL**: `/api/analysis/card-spending`

**Description**: 카드사별 결제 금액 통계

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| month | string | Yes | 조회 월 (YYYY-MM) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "cardSpending": [
      {
        "company": "삼성카드",
        "cardNumber": "1234",
        "amount": 520000,
        "percentage": 43.9,
        "color": "bg-blue-500",
        "transactionCount": 32
      },
      {
        "company": "신한카드",
        "cardNumber": "5678",
        "amount": 380000,
        "percentage": 32.1,
        "color": "bg-red-500",
        "transactionCount": 28
      },
      {
        "company": "현대카드",
        "cardNumber": "9012",
        "amount": 284000,
        "percentage": 24.0,
        "color": "bg-purple-500",
        "transactionCount": 18
      }
    ],
    "total": 1184000
  }
}
```

---

## 7. 설정 (Settings)

### API-028: 알림 설정 조회

**API ID**: `API-028`

**Method**: `GET`

**URL**: `/api/settings/notifications`

**Description**: 사용자 알림 설정 조회

**Request Headers**:
```
Authorization: Bearer {token}
```

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "budgetAlerts": true,
    "dailyReminders": true,
    "weeklyReports": true,
    "emailNotifications": false,
    "pushNotifications": true
  }
}
```

---

### API-029: 알림 설정 수정

**API ID**: `API-029`

**Method**: `PUT`

**URL**: `/api/settings/notifications`

**Description**: 사용자 알림 설정 수정

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "budgetAlerts": true,
  "dailyReminders": false,
  "weeklyReports": true,
  "emailNotifications": true,
  "pushNotifications": true
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| budgetAlerts | boolean | No | 예산 초과 알림 |
| dailyReminders | boolean | No | 일일 리마인더 |
| weeklyReports | boolean | No | 주간 리포트 |
| emailNotifications | boolean | No | 이메일 알림 |
| pushNotifications | boolean | No | 푸시 알림 |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "budgetAlerts": true,
    "dailyReminders": false,
    "weeklyReports": true,
    "emailNotifications": true,
    "pushNotifications": true
  }
}
```

---

### API-030: 개인정보 설정 조회

**API ID**: `API-030`

**Method**: `GET`

**URL**: `/api/settings/privacy`

**Description**: 개인정보 보호 설정 조회

**Request Headers**:
```
Authorization: Bearer {token}
```

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "dataSharing": false,
    "analytics": true,
    "autoBackup": true
  }
}
```

---

### API-031: 개인정보 설정 수정

**API ID**: `API-031`

**Method**: `PUT`

**URL**: `/api/settings/privacy`

**Description**: 개인정보 보호 설정 수정

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "dataSharing": false,
  "analytics": true,
  "autoBackup": true
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| dataSharing | boolean | No | 데이터 공유 허용 |
| analytics | boolean | No | 사용 분석 허용 |
| autoBackup | boolean | No | 자동 백업 활성화 |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "dataSharing": false,
    "analytics": true,
    "autoBackup": true
  }
}
```

---

## 8. 일정 (Schedule)

### API-032: 일정 목록 조회

**API ID**: `API-032`

**Method**: `GET`

**URL**: `/api/schedules`

**Description**: 일정 목록 조회 (특정 날짜 또는 기간)

**Request Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | No | 시작 날짜 (YYYY-MM-DD) |
| endDate | string | No | 종료 날짜 (YYYY-MM-DD) |
| date | string | No | 특정 날짜 (YYYY-MM-DD) |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "schedules": [
      {
        "id": 1,
        "title": "팀 회의",
        "description": "월간 팀 회의 및 프로젝트 진행 상황 공유",
        "date": "2025-11-15",
        "color": "#3b82f6",
        "likes": 5,
        "liked": false,
        "commentsCount": 3,
        "author": {
          "id": 1,
          "name": "김가계",
          "avatar": "https://storage.example.com/avatars/user1.jpg"
        },
        "createdAt": "2025-11-09T10:00:00Z",
        "updatedAt": "2025-11-09T10:00:00Z"
      }
    ]
  }
}
```

---

### API-033: 일정 생성

**API ID**: `API-033`

**Method**: `POST`

**URL**: `/api/schedules`

**Description**: 새로운 일정 생성

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "팀 회의",
  "description": "월간 팀 회의 및 프로젝트 진행 상황 공유",
  "date": "2025-11-15",
  "color": "#3b82f6"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | 일정 제목 (최대 100자) |
| description | string | No | 일정 설명 (최대 1000자) |
| date | string | Yes | 일정 날짜 (YYYY-MM-DD) |
| color | string | No | 표시 색상 (HEX 코드) |

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "팀 회의",
    "description": "월간 팀 회의 및 프로젝트 진행 상황 공유",
    "date": "2025-11-15",
    "color": "#3b82f6",
    "likes": 0,
    "liked": false,
    "commentsCount": 0,
    "author": {
      "id": 1,
      "name": "김가계",
      "avatar": "https://storage.example.com/avatars/user1.jpg"
    },
    "createdAt": "2025-11-09T10:00:00Z"
  }
}
```

---

### API-034: 일정 상세 조회

**API ID**: `API-034`

**Method**: `GET`

**URL**: `/api/schedules/{id}`

**Description**: 특정 일정 상세 정보 조회

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일정 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "팀 회의",
    "description": "월간 팀 회의 및 프로젝트 진행 상황 공유",
    "date": "2025-11-15",
    "color": "#3b82f6",
    "likes": 5,
    "liked": false,
    "comments": [
      {
        "id": 1,
        "author": "김민수",
        "authorId": 2,
        "content": "참석하겠습니다!",
        "date": "2025-11-09",
        "avatar": "https://storage.example.com/avatars/user2.jpg",
        "createdAt": "2025-11-09T11:00:00Z"
      }
    ],
    "author": {
      "id": 1,
      "name": "김가계",
      "avatar": "https://storage.example.com/avatars/user1.jpg"
    },
    "createdAt": "2025-11-09T10:00:00Z",
    "updatedAt": "2025-11-09T10:00:00Z"
  }
}
```

---

### API-035: 일정 수정

**API ID**: `API-035`

**Method**: `PUT`

**URL**: `/api/schedules/{id}`

**Description**: 일정 수정

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일정 ID |

**Request Body**:
```json
{
  "title": "팀 회의 (수정)",
  "description": "월간 팀 회의 및 프로젝트 진행 상황 공유 (수정)",
  "date": "2025-11-16",
  "color": "#10b981"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | No | 일정 제목 |
| description | string | No | 일정 설명 |
| date | string | No | 일정 날짜 |
| color | string | No | 표시 색상 |

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "팀 회의 (수정)",
    "description": "월간 팀 회의 및 프로젝트 진행 상황 공유 (수정)",
    "date": "2025-11-16",
    "color": "#10b981",
    "updatedAt": "2025-11-09T15:00:00Z"
  }
}
```

---

### API-036: 일정 삭제

**API ID**: `API-036`

**Method**: `DELETE`

**URL**: `/api/schedules/{id}`

**Description**: 일정 삭제

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일정 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "일정이 삭제되었습니다."
}
```

---

### API-037: 일정 좋아요 토글

**API ID**: `API-037`

**Method**: `POST`

**URL**: `/api/schedules/{id}/like`

**Description**: 일정 좋아요 추가/취소

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일정 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likes": 6
  }
}
```

---

### API-038: 일정 댓글 생성

**API ID**: `API-038`

**Method**: `POST`

**URL**: `/api/schedules/{id}/comments`

**Description**: 일정에 댓글 작성

**Request Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | 일정 ID |

**Request Body**:
```json
{
  "content": "참석하겠습니다!"
}
```

**Request Body Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| content | string | Yes | 댓글 내용 (최대 500자) |

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "author": "김가계",
    "authorId": 1,
    "content": "참석하겠습니다!",
    "date": "2025-11-09",
    "avatar": "https://storage.example.com/avatars/user1.jpg",
    "createdAt": "2025-11-09T16:00:00Z"
  }
}
```

---

### API-039: 일정 댓글 삭제

**API ID**: `API-039`

**Method**: `DELETE`

**URL**: `/api/schedules/{scheduleId}/comments/{commentId}`

**Description**: 일정 댓글 삭제

**Request Headers**:
```
Authorization: Bearer {token}
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| scheduleId | number | Yes | 일정 ID |
| commentId | number | Yes | 댓글 ID |

**Request Body**: 없음

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "댓글이 삭제되었습니다."
}
```

---

## 공통 사항

### 인증 (Authentication)

모든 보호된 API는 JWT 토큰 인증이 필요합니다.

**Header 형식**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 에러 응답 형식

**400 Bad Request**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": {
      "field": "email",
      "reason": "이메일 형식이 올바르지 않습니다."
    }
  }
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "인증이 필요합니다."
  }
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "권한이 없습니다."
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "요청한 리소스를 찾을 수 없습니다."
  }
}
```

**500 Internal Server Error**:
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "서버 오류가 발생했습니다."
  }
}
```

### 에러 코드 목록

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | 입력값 유효성 검증 실패 |
| INVALID_CREDENTIALS | 잘못된 인증 정보 |
| UNAUTHORIZED | 인증되지 않은 요청 |
| FORBIDDEN | 권한 없음 |
| NOT_FOUND | 리소스를 찾을 수 없음 |
| EMAIL_ALREADY_EXISTS | 이미 사용 중인 이메일 |
| INVALID_PASSWORD | 잘못된 비밀번호 |
| INTERNAL_SERVER_ERROR | 서버 내부 오류 |

### HTTP 상태 코드

| Status Code | Description |
|-------------|-------------|
| 200 | OK - 성공 |
| 201 | Created - 생성 성공 |
| 400 | Bad Request - 잘못된 요청 |
| 401 | Unauthorized - 인증 필요 |
| 403 | Forbidden - 권한 없음 |
| 404 | Not Found - 리소스 없음 |
| 500 | Internal Server Error - 서버 오류 |

### 날짜 및 시간 형식

- **날짜**: `YYYY-MM-DD` (예: 2025-08-14)
- **월**: `YYYY-MM` (예: 2025-08)
- **날짜+시간**: ISO 8601 형식 (예: 2025-08-14T10:30:00Z)

### 페이지네이션

**Query Parameters**:
- `page`: 페이지 번호 (1부터 시작)
- `limit`: 페이지당 항목 수 (기본값: 20, 최대: 100)

**Response Format**:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20
  }
}
```

### 파일 업로드

**Content-Type**: `multipart/form-data`

**지원 형식**:
- 이미지: JPG, PNG, GIF, WEBP
- 최대 크기: 10MB per file
- 최대 개수: 5 files per request

---

## API 요약표

| API ID | Method | URL | Description |
|--------|--------|-----|-------------|
| API-001 | POST | /api/auth/login | 로그인 |
| API-002 | POST | /api/auth/register | 회원가입 |
| API-003 | POST | /api/auth/logout | 로그아웃 |
| API-004 | PUT | /api/auth/password | 비밀번호 변경 |
| API-005 | GET | /api/profile | 프로필 조회 |
| API-006 | PUT | /api/profile | 프로필 수정 |
| API-007 | POST | /api/profile/avatar | 프로필 이미지 업로드 |
| API-008 | GET | /api/daily-life | 일상 목록 조회 |
| API-009 | POST | /api/daily-life | 일상 생성 |
| API-010 | GET | /api/daily-life/{id} | 일상 상세 조회 |
| API-011 | PUT | /api/daily-life/{id} | 일상 수정 |
| API-012 | DELETE | /api/daily-life/{id} | 일상 삭제 |
| API-013 | POST | /api/daily-life/{id}/like | 좋아요 토글 |
| API-014 | POST | /api/daily-life/{id}/comments | 댓글 생성 |
| API-015 | DELETE | /api/daily-life/{entryId}/comments/{commentId} | 댓글 삭제 |
| API-016 | GET | /api/transactions | 거래 목록 조회 |
| API-017 | POST | /api/transactions | 거래 생성 |
| API-018 | PUT | /api/transactions/{id} | 거래 수정 |
| API-019 | DELETE | /api/transactions/{id} | 거래 삭제 |
| API-020 | GET | /api/transactions/statistics/category | 카테고리별 통계 |
| API-021 | GET | /api/dashboard/summary | 대시보드 요약 |
| API-022 | GET | /api/notifications | 알림 목록 조회 |
| API-023 | PUT | /api/notifications/{id}/read | 알림 읽음 처리 |
| API-024 | GET | /api/daily-life/recent | 최근 일상 조회 |
| API-025 | GET | /api/analysis/monthly-comparison | 월별 비교 데이터 |
| API-026 | GET | /api/analysis/daily-spending | 일별 지출 추이 |
| API-027 | GET | /api/analysis/card-spending | 카드사별 결제 금액 |
| API-028 | GET | /api/settings/notifications | 알림 설정 조회 |
| API-029 | PUT | /api/settings/notifications | 알림 설정 수정 |
| API-030 | GET | /api/settings/privacy | 개인정보 설정 조회 |
| API-031 | PUT | /api/settings/privacy | 개인정보 설정 수정 |
| API-032 | GET | /api/schedules | 일정 목록 조회 |
| API-033 | POST | /api/schedules | 일정 생성 |
| API-034 | GET | /api/schedules/{id} | 일정 상세 조회 |
| API-035 | PUT | /api/schedules/{id} | 일정 수정 |
| API-036 | DELETE | /api/schedules/{id} | 일정 삭제 |
| API-037 | POST | /api/schedules/{id}/like | 일정 좋아요 토글 |
| API-038 | POST | /api/schedules/{id}/comments | 일정 댓글 생성 |
| API-039 | DELETE | /api/schedules/{scheduleId}/comments/{commentId} | 일정 댓글 삭제 |

---

**Total APIs**: 39

**Base URL (Development)**: `http://localhost:8000/api/v1`

**Base URL (Production)**: `https://api.example.com/v1`
