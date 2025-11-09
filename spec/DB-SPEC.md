# 데이터베이스 설계 명세서 (Database Schema Specification)

## 목차
1. [개요](#개요)
2. [ERD (Entity Relationship Diagram)](#erd-entity-relationship-diagram)
3. [테이블 설계](#테이블-설계)
4. [인덱스 전략](#인덱스-전략)
5. [제약조건](#제약조건)
6. [성능 최적화](#성능-최적화)

---

## 개요

### 데이터베이스 정보
- **DBMS**: PostgreSQL 14.x 이상
- **Character Set**: UTF8
- **Collation**: UTF8_general_ci
- **Time Zone**: UTC

### 설계 원칙
1. **정규화**: 3NF(Third Normal Form)까지 정규화
2. **인덱싱**: 조회 성능 최적화를 위한 적절한 인덱스 설계
3. **확장성**: 향후 기능 추가를 고려한 유연한 스키마
4. **데이터 무결성**: Foreign Key 및 Check 제약조건 활용
5. **감사 추적**: created_at, updated_at, deleted_at 컬럼 포함
6. **소프트 삭제**: deleted_at을 통한 논리적 삭제

---

## ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│     users       │
└────────┬────────┘
         │
         ├────────────────────────────────────────────────┐
         │                                                │
         │                                                │
┌────────▼────────┐                   ┌──────────────────▼───────┐
│ user_settings   │                   │   notifications          │
└─────────────────┘                   └──────────────────────────┘
         │
         │
┌────────▼────────────────┐           ┌──────────────────────┐
│ daily_life_entries      │           │    transactions      │
└────────┬────────────────┘           └──────┬───────────────┘
         │                                   │
         ├──────────┬──────────┐            │
         │          │          │            │
┌────────▼──┐  ┌───▼─────┐ ┌──▼──────┐     │
│ dl_images │  │dl_likes │ │dl_comments│    │
└───────────┘  └─────────┘ └───────────┘    │
         │                                   │
         │                          ┌────────▼──────┐
┌────────▼──────────┐               │   categories  │
│ daily_life_tags   │               └───────────────┘
│ (Many-to-Many)    │               ┌───────────────┐
└───────────────────┘               │    budgets    │
         │                          └───────────────┘
         │                          ┌───────────────┐
┌────────▼────────────┐             │     cards     │
│    schedules        │             └───────────────┘
└────────┬────────────┘
         │
         ├──────────┬──────────┐
         │          │          │
┌────────▼──┐  ┌───▼──────┐ ┌─▼───────────┐
│sch_likes │  │sch_comments│ (연결 users)
└───────────┘  └────────────┘
```

---

## 테이블 설계

### 1. users (사용자)

**설명**: 사용자 정보 및 인증 데이터

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 사용자 ID (PK) |
| name | VARCHAR(100) | NO | - | 사용자 이름 |
| email | VARCHAR(255) | NO | - | 이메일 (Unique) |
| password_hash | VARCHAR(255) | NO | - | 암호화된 비밀번호 |
| phone | VARCHAR(20) | YES | NULL | 전화번호 |
| avatar_url | TEXT | YES | NULL | 프로필 이미지 URL |
| email_verified | BOOLEAN | NO | FALSE | 이메일 인증 여부 |
| is_active | BOOLEAN | NO | TRUE | 계정 활성화 여부 |
| last_login_at | TIMESTAMP | YES | NULL | 마지막 로그인 시간 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |
| deleted_at | TIMESTAMP | YES | NULL | 삭제 시간 (소프트 삭제) |

**인덱스**:
- PRIMARY KEY: `id`
- UNIQUE INDEX: `email` (WHERE deleted_at IS NULL)
- INDEX: `created_at`

**제약조건**:
- `email` 형식 검증 (CHECK)
- `phone` 형식 검증 (CHECK)

---

### 2. user_settings (사용자 설정)

**설명**: 사용자별 알림 및 개인정보 설정

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 설정 ID (PK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| budget_alerts | BOOLEAN | NO | TRUE | 예산 초과 알림 |
| daily_reminders | BOOLEAN | NO | TRUE | 일일 리마인더 |
| weekly_reports | BOOLEAN | NO | TRUE | 주간 리포트 |
| email_notifications | BOOLEAN | NO | FALSE | 이메일 알림 |
| push_notifications | BOOLEAN | NO | TRUE | 푸시 알림 |
| data_sharing | BOOLEAN | NO | FALSE | 데이터 공유 |
| analytics | BOOLEAN | NO | TRUE | 사용 분석 |
| auto_backup | BOOLEAN | NO | TRUE | 자동 백업 |
| language | VARCHAR(10) | NO | 'ko' | 언어 설정 |
| theme | VARCHAR(20) | NO | 'light' | 테마 (light/dark) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- UNIQUE INDEX: `user_id`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### 3. categories (카테고리)

**설명**: 수입/지출 카테고리

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 카테고리 ID (PK) |
| user_id | BIGINT | YES | NULL | 사용자 ID (NULL이면 시스템 기본) |
| name | VARCHAR(50) | NO | - | 카테고리 이름 |
| type | VARCHAR(20) | NO | - | 유형 (income/expense) |
| color | VARCHAR(20) | YES | NULL | 색상 코드 |
| icon | VARCHAR(50) | YES | NULL | 아이콘 이름 |
| is_default | BOOLEAN | NO | FALSE | 기본 카테고리 여부 |
| display_order | INTEGER | NO | 0 | 표시 순서 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |
| deleted_at | TIMESTAMP | YES | NULL | 삭제 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `user_id`, `type`
- INDEX: `name`, `type` (WHERE deleted_at IS NULL)
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**제약조건**:
- CHECK: `type IN ('income', 'expense')`

---

### 4. budgets (예산)

**설명**: 카테고리별 월간 예산

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 예산 ID (PK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| category_id | BIGINT | NO | - | 카테고리 ID (FK) |
| amount | DECIMAL(15,2) | NO | - | 예산 금액 |
| month | DATE | NO | - | 해당 월 (YYYY-MM-01) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- UNIQUE INDEX: `user_id`, `category_id`, `month`
- INDEX: `user_id`, `month`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `category_id` REFERENCES `categories(id)` ON DELETE CASCADE

**제약조건**:
- CHECK: `amount >= 0`

---

### 5. transactions (거래)

**설명**: 수입/지출 거래 내역

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 거래 ID (PK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| category_id | BIGINT | NO | - | 카테고리 ID (FK) |
| card_id | BIGINT | YES | NULL | 카드 ID (FK) |
| description | VARCHAR(200) | NO | - | 거래 내용 |
| amount | DECIMAL(15,2) | NO | - | 금액 |
| type | VARCHAR(20) | NO | - | 유형 (income/expense) |
| transaction_date | DATE | NO | - | 거래 날짜 |
| is_auto_classified | BOOLEAN | NO | FALSE | 자동 분류 여부 |
| memo | TEXT | YES | NULL | 메모 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |
| deleted_at | TIMESTAMP | YES | NULL | 삭제 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `user_id`, `transaction_date` DESC
- INDEX: `user_id`, `category_id`, `transaction_date`
- INDEX: `user_id`, `type`, `transaction_date`
- INDEX: `created_at`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `category_id` REFERENCES `categories(id)` ON DELETE RESTRICT
- FOREIGN KEY: `card_id` REFERENCES `cards(id)` ON DELETE SET NULL

**제약조건**:
- CHECK: `type IN ('income', 'expense')`
- CHECK: `amount > 0`

---

### 6. cards (카드)

**설명**: 사용자 카드 정보

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 카드 ID (PK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| company | VARCHAR(50) | NO | - | 카드사 |
| card_number_last4 | VARCHAR(4) | NO | - | 카드번호 뒤 4자리 |
| card_nickname | VARCHAR(50) | YES | NULL | 카드 별칭 |
| color | VARCHAR(20) | YES | NULL | 표시 색상 |
| is_active | BOOLEAN | NO | TRUE | 활성 상태 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |
| deleted_at | TIMESTAMP | YES | NULL | 삭제 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `user_id`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### 7. daily_life_entries (일상 기록)

**설명**: 일상 기록 엔트리

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 기록 ID (PK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| title | VARCHAR(100) | NO | - | 제목 |
| content | TEXT | NO | - | 내용 |
| mood | VARCHAR(20) | NO | - | 기분 (good/neutral/bad) |
| category | VARCHAR(50) | NO | - | 카테고리 |
| entry_date | DATE | NO | - | 기록 날짜 |
| likes_count | INTEGER | NO | 0 | 좋아요 수 |
| comments_count | INTEGER | NO | 0 | 댓글 수 |
| views_count | INTEGER | NO | 0 | 조회 수 |
| is_private | BOOLEAN | NO | FALSE | 비공개 여부 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |
| deleted_at | TIMESTAMP | YES | NULL | 삭제 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `user_id`, `entry_date` DESC
- INDEX: `user_id`, `category`, `entry_date`
- INDEX: `user_id`, `mood`, `entry_date`
- INDEX: `created_at`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**제약조건**:
- CHECK: `mood IN ('good', 'neutral', 'bad')`
- CHECK: `likes_count >= 0`
- CHECK: `comments_count >= 0`

---

### 8. daily_life_images (일상 기록 이미지)

**설명**: 일상 기록에 첨부된 이미지

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 이미지 ID (PK) |
| entry_id | BIGINT | NO | - | 기록 ID (FK) |
| image_url | TEXT | NO | - | 이미지 URL |
| image_order | INTEGER | NO | 0 | 이미지 순서 |
| file_size | INTEGER | YES | NULL | 파일 크기 (bytes) |
| mime_type | VARCHAR(50) | YES | NULL | MIME 타입 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `entry_id`, `image_order`
- FOREIGN KEY: `entry_id` REFERENCES `daily_life_entries(id)` ON DELETE CASCADE

---

### 9. daily_life_tags (일상 기록 태그)

**설명**: 일상 기록과 태그의 다대다 관계

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | ID (PK) |
| entry_id | BIGINT | NO | - | 기록 ID (FK) |
| tag_name | VARCHAR(50) | NO | - | 태그 이름 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- UNIQUE INDEX: `entry_id`, `tag_name`
- INDEX: `tag_name`
- FOREIGN KEY: `entry_id` REFERENCES `daily_life_entries(id)` ON DELETE CASCADE

---

### 10. daily_life_likes (일상 기록 좋아요)

**설명**: 일상 기록 좋아요

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | ID (PK) |
| entry_id | BIGINT | NO | - | 기록 ID (FK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- UNIQUE INDEX: `entry_id`, `user_id`
- INDEX: `user_id`
- FOREIGN KEY: `entry_id` REFERENCES `daily_life_entries(id)` ON DELETE CASCADE
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### 11. daily_life_comments (일상 기록 댓글)

**설명**: 일상 기록 댓글

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 댓글 ID (PK) |
| entry_id | BIGINT | NO | - | 기록 ID (FK) |
| user_id | BIGINT | NO | - | 작성자 ID (FK) |
| parent_id | BIGINT | YES | NULL | 부모 댓글 ID (대댓글) |
| content | TEXT | NO | - | 댓글 내용 |
| is_edited | BOOLEAN | NO | FALSE | 수정 여부 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |
| deleted_at | TIMESTAMP | YES | NULL | 삭제 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `entry_id`, `created_at`
- INDEX: `user_id`
- INDEX: `parent_id`
- FOREIGN KEY: `entry_id` REFERENCES `daily_life_entries(id)` ON DELETE CASCADE
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `parent_id` REFERENCES `daily_life_comments(id)` ON DELETE CASCADE

---

### 12. notifications (알림)

**설명**: 사용자 알림

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 알림 ID (PK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| title | VARCHAR(100) | NO | - | 알림 제목 |
| message | TEXT | NO | - | 알림 메시지 |
| type | VARCHAR(20) | NO | - | 유형 (warning/success/info/error) |
| icon | VARCHAR(50) | YES | NULL | 아이콘 |
| is_read | BOOLEAN | NO | FALSE | 읽음 여부 |
| related_type | VARCHAR(50) | YES | NULL | 관련 엔티티 타입 |
| related_id | BIGINT | YES | NULL | 관련 엔티티 ID |
| action_url | TEXT | YES | NULL | 액션 URL |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| read_at | TIMESTAMP | YES | NULL | 읽은 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `user_id`, `created_at` DESC
- INDEX: `user_id`, `is_read`, `created_at` DESC
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**제약조건**:
- CHECK: `type IN ('warning', 'success', 'info', 'error')`

---

### 13. refresh_tokens (리프레시 토큰)

**설명**: JWT 리프레시 토큰 관리

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 토큰 ID (PK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| token | VARCHAR(500) | NO | - | 리프레시 토큰 |
| expires_at | TIMESTAMP | NO | - | 만료 시간 |
| is_revoked | BOOLEAN | NO | FALSE | 폐기 여부 |
| user_agent | TEXT | YES | NULL | User Agent |
| ip_address | VARCHAR(45) | YES | NULL | IP 주소 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- UNIQUE INDEX: `token`
- INDEX: `user_id`, `expires_at`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### 14. schedules (일정)

**설명**: 공유 일정 정보

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 일정 ID (PK) |
| user_id | BIGINT | NO | - | 작성자 ID (FK) |
| title | VARCHAR(100) | NO | - | 일정 제목 |
| description | TEXT | YES | NULL | 일정 설명 |
| schedule_date | DATE | NO | - | 일정 날짜 |
| color | VARCHAR(20) | YES | '#3b82f6' | 표시 색상 (HEX) |
| likes_count | INTEGER | NO | 0 | 좋아요 수 |
| comments_count | INTEGER | NO | 0 | 댓글 수 |
| is_public | BOOLEAN | NO | TRUE | 공개 여부 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |
| deleted_at | TIMESTAMP | YES | NULL | 삭제 시간 (소프트 삭제) |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `user_id`, `schedule_date` DESC
- INDEX: `schedule_date`
- INDEX: `created_at`
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**제약조건**:
- CHECK: `likes_count >= 0`
- CHECK: `comments_count >= 0`

---

### 15. schedule_likes (일정 좋아요)

**설명**: 일정 좋아요

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | ID (PK) |
| schedule_id | BIGINT | NO | - | 일정 ID (FK) |
| user_id | BIGINT | NO | - | 사용자 ID (FK) |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- UNIQUE INDEX: `schedule_id`, `user_id`
- INDEX: `user_id`
- FOREIGN KEY: `schedule_id` REFERENCES `schedules(id)` ON DELETE CASCADE
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### 16. schedule_comments (일정 댓글)

**설명**: 일정 댓글

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|-------------|------|--------|------|
| id | BIGSERIAL | NO | - | 댓글 ID (PK) |
| schedule_id | BIGINT | NO | - | 일정 ID (FK) |
| user_id | BIGINT | NO | - | 작성자 ID (FK) |
| parent_id | BIGINT | YES | NULL | 부모 댓글 ID (대댓글) |
| content | TEXT | NO | - | 댓글 내용 |
| is_edited | BOOLEAN | NO | FALSE | 수정 여부 |
| created_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | NO | CURRENT_TIMESTAMP | 수정 시간 |
| deleted_at | TIMESTAMP | YES | NULL | 삭제 시간 |

**인덱스**:
- PRIMARY KEY: `id`
- INDEX: `schedule_id`, `created_at`
- INDEX: `user_id`
- INDEX: `parent_id`
- FOREIGN KEY: `schedule_id` REFERENCES `schedules(id)` ON DELETE CASCADE
- FOREIGN KEY: `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- FOREIGN KEY: `parent_id` REFERENCES `schedule_comments(id)` ON DELETE CASCADE

---

## 인덱스 전략

### 1. 단일 컬럼 인덱스
- **users**: email (로그인 조회)
- **transactions**: transaction_date (날짜별 조회)
- **daily_life_entries**: entry_date (날짜별 조회)

### 2. 복합 인덱스
- **transactions**: (user_id, transaction_date DESC) - 사용자별 거래 목록
- **transactions**: (user_id, category_id, transaction_date) - 카테고리별 통계
- **daily_life_entries**: (user_id, entry_date DESC) - 사용자별 일상 목록
- **notifications**: (user_id, is_read, created_at DESC) - 읽지 않은 알림 조회

### 3. 부분 인덱스 (Partial Index)
- **users**: email WHERE deleted_at IS NULL (활성 사용자만)
- **categories**: name WHERE deleted_at IS NULL (삭제되지 않은 카테고리)

### 4. 함수 기반 인덱스
```sql
-- 대소문자 구분 없는 이메일 검색
CREATE INDEX idx_users_email_lower ON users (LOWER(email));

-- 월별 거래 조회
CREATE INDEX idx_transactions_month ON transactions (user_id, DATE_TRUNC('month', transaction_date));
```

---

## 제약조건

### 1. Primary Key
- 모든 테이블에 BIGSERIAL 타입의 id 컬럼을 기본 키로 사용

### 2. Foreign Key
- ON DELETE CASCADE: 부모 삭제 시 자식도 삭제
- ON DELETE RESTRICT: 자식이 있으면 부모 삭제 불가
- ON DELETE SET NULL: 부모 삭제 시 자식의 FK를 NULL로 설정

### 3. Unique
- users.email (삭제되지 않은 레코드만)
- user_settings.user_id
- budgets.(user_id, category_id, month)

### 4. Check
- transactions.amount > 0
- transactions.type IN ('income', 'expense')
- daily_life_entries.mood IN ('good', 'neutral', 'bad')

### 5. Not Null
- 필수 필드에 대한 NOT NULL 제약

---

## 성능 최적화

### 1. 파티셔닝

#### transactions 테이블 월별 파티셔닝
```sql
-- Range Partitioning by transaction_date
CREATE TABLE transactions_2025_01 PARTITION OF transactions
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE transactions_2025_02 PARTITION OF transactions
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### 2. 집계 테이블 (Materialized View)

#### 월별 카테고리 통계
```sql
CREATE MATERIALIZED VIEW mv_monthly_category_stats AS
SELECT
    user_id,
    category_id,
    DATE_TRUNC('month', transaction_date) AS month,
    type,
    SUM(amount) AS total_amount,
    COUNT(*) AS transaction_count,
    AVG(amount) AS avg_amount
FROM transactions
WHERE deleted_at IS NULL
GROUP BY user_id, category_id, DATE_TRUNC('month', transaction_date), type;

CREATE UNIQUE INDEX ON mv_monthly_category_stats (user_id, category_id, month, type);
```

### 3. 캐싱 전략

#### Redis 캐싱 대상
- 사용자 세션 정보
- 대시보드 요약 데이터 (TTL: 5분)
- 월별 통계 (TTL: 1시간)
- 읽지 않은 알림 수 (TTL: 1분)

### 4. 쿼리 최적화

#### 읽지 않은 알림 수 조회
```sql
-- 비효율적
SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = FALSE;

-- 효율적 (인덱스 활용)
SELECT COUNT(*) FROM notifications
WHERE user_id = ? AND is_read = FALSE AND created_at > NOW() - INTERVAL '30 days';
```

### 5. 연결 풀링
- **최소 연결**: 10
- **최대 연결**: 50
- **Idle Timeout**: 10분

---

## 데이터 보관 정책

### 1. 소프트 삭제
- users, transactions, daily_life_entries, cards, categories
- deleted_at IS NOT NULL인 레코드는 조회에서 제외

### 2. 하드 삭제
- 30일 이상 소프트 삭제된 레코드는 배치 작업으로 하드 삭제
- 개인정보 보호 규정 준수

### 3. 아카이빙
- 1년 이상 된 거래 내역은 별도 아카이브 테이블로 이동
- 읽은 알림은 30일 후 삭제

---

## 보안 고려사항

### 1. 암호화
- **비밀번호**: bcrypt 해싱 (cost factor: 12)
- **민감 정보**: AES-256 암호화

### 2. Row Level Security (RLS)
```sql
-- 사용자는 자신의 데이터만 조회 가능
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY transactions_user_policy ON transactions
    FOR ALL
    USING (user_id = current_user_id());
```

### 3. 감사 로그
- 모든 데이터 변경 이력을 별도 audit_logs 테이블에 기록
- 트리거를 통한 자동 기록

---

## 백업 및 복구

### 1. 백업 전략
- **전체 백업**: 매일 새벽 2시 (보관: 7일)
- **증분 백업**: 매 6시간 (보관: 2일)
- **트랜잭션 로그**: 실시간 (보관: 7일)

### 2. 복구 시나리오
- Point-in-Time Recovery (PITR) 지원
- 최대 7일 이내 시점으로 복구 가능

---

## 모니터링

### 1. 성능 메트릭
- 쿼리 실행 시간
- 테이블 크기
- 인덱스 사용률
- 캐시 히트율

### 2. 알람 설정
- 연결 수 > 45 (90%)
- 느린 쿼리 > 1초
- 테이블 락 대기 > 5초
- 디스크 사용률 > 80%

---

## 확장성 계획

### 1. 수평 확장
- Read Replica를 통한 읽기 성능 향상
- 쓰기는 Master, 읽기는 Replica 분산

### 2. 샤딩 전략
- user_id 기반 샤딩
- 사용자당 독립적인 데이터 구조

### 3. 마이그레이션
- Flyway 또는 Liquibase를 통한 버전 관리
- Zero-downtime 마이그레이션 지원

---

## 테이블 요약

| 순번 | 테이블명 | 설명 | 예상 레코드 수 |
|------|----------|------|----------------|
| 1 | users | 사용자 | 100K |
| 2 | user_settings | 사용자 설정 | 100K |
| 3 | categories | 카테고리 | 1K |
| 4 | budgets | 예산 | 500K |
| 5 | transactions | 거래 | 10M+ |
| 6 | cards | 카드 | 200K |
| 7 | daily_life_entries | 일상 기록 | 5M |
| 8 | daily_life_images | 일상 이미지 | 15M |
| 9 | daily_life_tags | 일상 태그 | 10M |
| 10 | daily_life_likes | 일상 좋아요 | 20M |
| 11 | daily_life_comments | 일상 댓글 | 10M |
| 12 | notifications | 알림 | 50M |
| 13 | refresh_tokens | 리프레시 토큰 | 500K |
| 14 | schedules | 일정 | 3M |
| 15 | schedule_likes | 일정 좋아요 | 10M |
| 16 | schedule_comments | 일정 댓글 | 5M |

**총 16개 테이블**

---

## 버전 관리

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2025-08-14 | 초기 스키마 설계 | Database Team |

---

**문서 작성일**: 2025-08-14
**최종 수정일**: 2025-08-14
**작성자**: Database Architect
