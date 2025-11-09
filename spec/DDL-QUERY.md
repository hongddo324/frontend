# PostgreSQL DDL 스크립트 (Data Definition Language)

## 목차
1. [데이터베이스 생성](#데이터베이스-생성)
2. [테이블 생성](#테이블-생성)
3. [인덱스 생성](#인덱스-생성)
4. [외래 키 생성](#외래-키-생성)
5. [함수 및 트리거](#함수-및-트리거)
6. [Materialized View](#materialized-view)
7. [Row Level Security](#row-level-security)
8. [초기 데이터](#초기-데이터)

---

## 데이터베이스 생성

```sql
-- 데이터베이스 생성
CREATE DATABASE smart_budget_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE = template0;

-- 데이터베이스 연결
\c smart_budget_db;

-- 확장 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## 테이블 생성

### 1. users (사용자)

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_users_phone_format CHECK (phone IS NULL OR phone ~* '^\+?[0-9]{10,15}$')
);

-- 테이블 코멘트
COMMENT ON TABLE users IS '사용자 정보 및 인증 데이터';
COMMENT ON COLUMN users.id IS '사용자 ID (Primary Key)';
COMMENT ON COLUMN users.email IS '이메일 주소 (고유값)';
COMMENT ON COLUMN users.password_hash IS 'bcrypt 해싱된 비밀번호';
COMMENT ON COLUMN users.email_verified IS '이메일 인증 완료 여부';
COMMENT ON COLUMN users.deleted_at IS '소프트 삭제 시간 (NULL이면 활성)';
```

### 2. user_settings (사용자 설정)

```sql
CREATE TABLE user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    budget_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    daily_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    weekly_reports BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN NOT NULL DEFAULT FALSE,
    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    data_sharing BOOLEAN NOT NULL DEFAULT FALSE,
    analytics BOOLEAN NOT NULL DEFAULT TRUE,
    auto_backup BOOLEAN NOT NULL DEFAULT TRUE,
    language VARCHAR(10) NOT NULL DEFAULT 'ko',
    theme VARCHAR(20) NOT NULL DEFAULT 'light',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_user_settings_language CHECK (language IN ('ko', 'en', 'ja', 'zh')),
    CONSTRAINT chk_user_settings_theme CHECK (theme IN ('light', 'dark', 'auto'))
);

COMMENT ON TABLE user_settings IS '사용자별 알림 및 개인정보 설정';
COMMENT ON COLUMN user_settings.user_id IS '사용자 ID (users 테이블 참조)';
COMMENT ON COLUMN user_settings.budget_alerts IS '예산 초과 알림 수신 여부';
COMMENT ON COLUMN user_settings.language IS '언어 설정 (ko, en, ja, zh)';
COMMENT ON COLUMN user_settings.theme IS '테마 설정 (light, dark, auto)';
```

### 3. categories (카테고리)

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    color VARCHAR(20),
    icon VARCHAR(50),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_categories_type CHECK (type IN ('income', 'expense'))
);

COMMENT ON TABLE categories IS '수입/지출 카테고리';
COMMENT ON COLUMN categories.user_id IS '사용자 ID (NULL이면 시스템 기본 카테고리)';
COMMENT ON COLUMN categories.type IS '카테고리 유형 (income: 수입, expense: 지출)';
COMMENT ON COLUMN categories.is_default IS '시스템 기본 카테고리 여부';
```

### 4. budgets (예산)

```sql
CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    month DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_budgets_amount_positive CHECK (amount >= 0)
);

COMMENT ON TABLE budgets IS '카테고리별 월간 예산';
COMMENT ON COLUMN budgets.month IS '예산이 적용되는 월 (YYYY-MM-01 형식)';
COMMENT ON COLUMN budgets.amount IS '예산 금액';
```

### 5. transactions (거래)

```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    card_id BIGINT,
    description VARCHAR(200) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) NOT NULL,
    transaction_date DATE NOT NULL,
    is_auto_classified BOOLEAN NOT NULL DEFAULT FALSE,
    memo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_transactions_type CHECK (type IN ('income', 'expense')),
    CONSTRAINT chk_transactions_amount_positive CHECK (amount > 0)
);

COMMENT ON TABLE transactions IS '수입/지출 거래 내역';
COMMENT ON COLUMN transactions.transaction_date IS '거래 발생 날짜';
COMMENT ON COLUMN transactions.is_auto_classified IS 'AI 기반 자동 분류 여부';
COMMENT ON COLUMN transactions.card_id IS '결제 카드 ID (현금일 경우 NULL)';
```

### 6. cards (카드)

```sql
CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company VARCHAR(50) NOT NULL,
    card_number_last4 VARCHAR(4) NOT NULL,
    card_nickname VARCHAR(50),
    color VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_cards_last4_format CHECK (card_number_last4 ~* '^[0-9]{4}$')
);

COMMENT ON TABLE cards IS '사용자 카드 정보';
COMMENT ON COLUMN cards.company IS '카드사 이름 (예: 신한, KB국민, 삼성)';
COMMENT ON COLUMN cards.card_number_last4 IS '카드번호 뒤 4자리 (보안)';
COMMENT ON COLUMN cards.card_nickname IS '카드 별칭 (사용자 정의)';
```

### 7. daily_life_entries (일상 기록)

```sql
CREATE TABLE daily_life_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    mood VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    entry_date DATE NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_daily_life_mood CHECK (mood IN ('good', 'neutral', 'bad')),
    CONSTRAINT chk_daily_life_likes_count CHECK (likes_count >= 0),
    CONSTRAINT chk_daily_life_comments_count CHECK (comments_count >= 0),
    CONSTRAINT chk_daily_life_views_count CHECK (views_count >= 0)
);

COMMENT ON TABLE daily_life_entries IS '일상 기록 엔트리';
COMMENT ON COLUMN daily_life_entries.mood IS '기분 상태 (good, neutral, bad)';
COMMENT ON COLUMN daily_life_entries.category IS '일상 카테고리 (여행, 음식, 운동 등)';
COMMENT ON COLUMN daily_life_entries.is_private IS '비공개 게시글 여부';
```

### 8. daily_life_images (일상 기록 이미지)

```sql
CREATE TABLE daily_life_images (
    id BIGSERIAL PRIMARY KEY,
    entry_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    image_order INTEGER NOT NULL DEFAULT 0,
    file_size INTEGER,
    mime_type VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_daily_life_images_order CHECK (image_order >= 0),
    CONSTRAINT chk_daily_life_images_file_size CHECK (file_size IS NULL OR file_size > 0)
);

COMMENT ON TABLE daily_life_images IS '일상 기록에 첨부된 이미지';
COMMENT ON COLUMN daily_life_images.image_order IS '이미지 표시 순서 (0부터 시작)';
COMMENT ON COLUMN daily_life_images.file_size IS '파일 크기 (bytes)';
COMMENT ON COLUMN daily_life_images.mime_type IS 'MIME 타입 (image/jpeg, image/png 등)';
```

### 9. daily_life_tags (일상 기록 태그)

```sql
CREATE TABLE daily_life_tags (
    id BIGSERIAL PRIMARY KEY,
    entry_id BIGINT NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE daily_life_tags IS '일상 기록과 태그의 다대다 관계';
COMMENT ON COLUMN daily_life_tags.tag_name IS '태그 이름 (예: #여행, #맛집)';
```

### 10. daily_life_likes (일상 기록 좋아요)

```sql
CREATE TABLE daily_life_likes (
    id BIGSERIAL PRIMARY KEY,
    entry_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE daily_life_likes IS '일상 기록 좋아요';
```

### 11. daily_life_comments (일상 기록 댓글)

```sql
CREATE TABLE daily_life_comments (
    id BIGSERIAL PRIMARY KEY,
    entry_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT,
    content TEXT NOT NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

COMMENT ON TABLE daily_life_comments IS '일상 기록 댓글';
COMMENT ON COLUMN daily_life_comments.parent_id IS '부모 댓글 ID (대댓글인 경우)';
COMMENT ON COLUMN daily_life_comments.is_edited IS '수정 여부';
```

### 12. notifications (알림)

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    icon VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_type VARCHAR(50),
    related_id BIGINT,
    action_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_notifications_type CHECK (type IN ('warning', 'success', 'info', 'error'))
);

COMMENT ON TABLE notifications IS '사용자 알림';
COMMENT ON COLUMN notifications.type IS '알림 유형 (warning, success, info, error)';
COMMENT ON COLUMN notifications.related_type IS '관련 엔티티 타입 (transaction, daily_life 등)';
COMMENT ON COLUMN notifications.related_id IS '관련 엔티티 ID';
COMMENT ON COLUMN notifications.action_url IS '알림 클릭 시 이동할 URL';
```

### 13. refresh_tokens (리프레시 토큰)

```sql
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_refresh_tokens_expires CHECK (expires_at > created_at)
);

COMMENT ON TABLE refresh_tokens IS 'JWT 리프레시 토큰 관리';
COMMENT ON COLUMN refresh_tokens.token IS '리프레시 토큰 값';
COMMENT ON COLUMN refresh_tokens.expires_at IS '토큰 만료 시간';
COMMENT ON COLUMN refresh_tokens.is_revoked IS '토큰 폐기 여부 (로그아웃 시)';
```

### 14. schedules (일정)

```sql
CREATE TABLE schedules (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    schedule_date DATE NOT NULL,
    color VARCHAR(20) DEFAULT '#3b82f6',
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    -- 제약조건
    CONSTRAINT chk_schedules_likes_count CHECK (likes_count >= 0),
    CONSTRAINT chk_schedules_comments_count CHECK (comments_count >= 0)
);

COMMENT ON TABLE schedules IS '공유 일정 정보';
COMMENT ON COLUMN schedules.user_id IS '작성자 ID (users 테이블 참조)';
COMMENT ON COLUMN schedules.title IS '일정 제목';
COMMENT ON COLUMN schedules.description IS '일정 설명';
COMMENT ON COLUMN schedules.schedule_date IS '일정 날짜';
COMMENT ON COLUMN schedules.color IS '표시 색상 (HEX 코드)';
COMMENT ON COLUMN schedules.is_public IS '공개 여부';
```

### 15. schedule_likes (일정 좋아요)

```sql
CREATE TABLE schedule_likes (
    id BIGSERIAL PRIMARY KEY,
    schedule_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE schedule_likes IS '일정 좋아요';
COMMENT ON COLUMN schedule_likes.schedule_id IS '일정 ID (schedules 테이블 참조)';
COMMENT ON COLUMN schedule_likes.user_id IS '사용자 ID (users 테이블 참조)';
```

### 16. schedule_comments (일정 댓글)

```sql
CREATE TABLE schedule_comments (
    id BIGSERIAL PRIMARY KEY,
    schedule_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_id BIGINT,
    content TEXT NOT NULL,
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

COMMENT ON TABLE schedule_comments IS '일정 댓글';
COMMENT ON COLUMN schedule_comments.schedule_id IS '일정 ID (schedules 테이블 참조)';
COMMENT ON COLUMN schedule_comments.user_id IS '작성자 ID (users 테이블 참조)';
COMMENT ON COLUMN schedule_comments.parent_id IS '부모 댓글 ID (대댓글인 경우)';
COMMENT ON COLUMN schedule_comments.is_edited IS '수정 여부';
```

---

## 인덱스 생성

### users 테이블 인덱스

```sql
-- 이메일 유니크 인덱스 (삭제되지 않은 레코드만)
CREATE UNIQUE INDEX idx_users_email_unique
    ON users (email)
    WHERE deleted_at IS NULL;

-- 생성일 인덱스
CREATE INDEX idx_users_created_at
    ON users (created_at);

-- 대소문자 구분 없는 이메일 검색
CREATE INDEX idx_users_email_lower
    ON users (LOWER(email));
```

### user_settings 테이블 인덱스

```sql
-- user_id 유니크 인덱스 (사용자당 하나의 설정)
CREATE UNIQUE INDEX idx_user_settings_user_id
    ON user_settings (user_id);
```

### categories 테이블 인덱스

```sql
-- user_id와 type 복합 인덱스
CREATE INDEX idx_categories_user_type
    ON categories (user_id, type);

-- 이름과 타입 인덱스 (삭제되지 않은 카테고리만)
CREATE INDEX idx_categories_name_type
    ON categories (name, type)
    WHERE deleted_at IS NULL;
```

### budgets 테이블 인덱스

```sql
-- 유니크 제약: 사용자별 카테고리별 월별 예산 하나
CREATE UNIQUE INDEX idx_budgets_user_category_month
    ON budgets (user_id, category_id, month);

-- 사용자별 월별 조회
CREATE INDEX idx_budgets_user_month
    ON budgets (user_id, month);
```

### transactions 테이블 인덱스

```sql
-- 사용자별 거래 날짜 내림차순 (최근 거래 조회)
CREATE INDEX idx_transactions_user_date_desc
    ON transactions (user_id, transaction_date DESC);

-- 사용자별 카테고리별 거래 날짜
CREATE INDEX idx_transactions_user_category_date
    ON transactions (user_id, category_id, transaction_date);

-- 사용자별 유형별 거래 날짜
CREATE INDEX idx_transactions_user_type_date
    ON transactions (user_id, type, transaction_date);

-- 생성일 인덱스
CREATE INDEX idx_transactions_created_at
    ON transactions (created_at);

-- 월별 거래 조회를 위한 함수 기반 인덱스
CREATE INDEX idx_transactions_user_month
    ON transactions (user_id, DATE_TRUNC('month', transaction_date));

-- 삭제되지 않은 거래만 조회
CREATE INDEX idx_transactions_not_deleted
    ON transactions (user_id, transaction_date DESC)
    WHERE deleted_at IS NULL;
```

### cards 테이블 인덱스

```sql
-- 사용자별 카드 조회
CREATE INDEX idx_cards_user_id
    ON cards (user_id);

-- 활성 카드만 조회
CREATE INDEX idx_cards_user_active
    ON cards (user_id, is_active)
    WHERE deleted_at IS NULL;
```

### daily_life_entries 테이블 인덱스

```sql
-- 사용자별 기록 날짜 내림차순
CREATE INDEX idx_daily_life_user_date_desc
    ON daily_life_entries (user_id, entry_date DESC);

-- 사용자별 카테고리별 날짜
CREATE INDEX idx_daily_life_user_category_date
    ON daily_life_entries (user_id, category, entry_date);

-- 사용자별 기분별 날짜
CREATE INDEX idx_daily_life_user_mood_date
    ON daily_life_entries (user_id, mood, entry_date);

-- 생성일 인덱스
CREATE INDEX idx_daily_life_created_at
    ON daily_life_entries (created_at);

-- 공개 게시물만 조회 (피드용)
CREATE INDEX idx_daily_life_public_recent
    ON daily_life_entries (entry_date DESC)
    WHERE is_private = FALSE AND deleted_at IS NULL;
```

### daily_life_images 테이블 인덱스

```sql
-- 기록별 이미지 순서
CREATE INDEX idx_daily_life_images_entry_order
    ON daily_life_images (entry_id, image_order);
```

### daily_life_tags 테이블 인덱스

```sql
-- 기록별 태그 유니크 제약
CREATE UNIQUE INDEX idx_daily_life_tags_entry_tag
    ON daily_life_tags (entry_id, tag_name);

-- 태그 이름으로 검색
CREATE INDEX idx_daily_life_tags_tag_name
    ON daily_life_tags (tag_name);

-- 태그별 기록 수 집계용
CREATE INDEX idx_daily_life_tags_tag_created
    ON daily_life_tags (tag_name, created_at DESC);
```

### daily_life_likes 테이블 인덱스

```sql
-- 기록별 사용자별 좋아요 유니크 제약 (중복 좋아요 방지)
CREATE UNIQUE INDEX idx_daily_life_likes_entry_user
    ON daily_life_likes (entry_id, user_id);

-- 사용자별 좋아요 목록 조회
CREATE INDEX idx_daily_life_likes_user_id
    ON daily_life_likes (user_id, created_at DESC);
```

### daily_life_comments 테이블 인덱스

```sql
-- 기록별 댓글 생성일 순
CREATE INDEX idx_daily_life_comments_entry_created
    ON daily_life_comments (entry_id, created_at);

-- 사용자별 댓글 조회
CREATE INDEX idx_daily_life_comments_user_id
    ON daily_life_comments (user_id);

-- 부모 댓글 ID (대댓글 조회)
CREATE INDEX idx_daily_life_comments_parent_id
    ON daily_life_comments (parent_id);

-- 삭제되지 않은 댓글만 조회
CREATE INDEX idx_daily_life_comments_not_deleted
    ON daily_life_comments (entry_id, created_at)
    WHERE deleted_at IS NULL;
```

### notifications 테이블 인덱스

```sql
-- 사용자별 알림 생성일 내림차순
CREATE INDEX idx_notifications_user_created_desc
    ON notifications (user_id, created_at DESC);

-- 사용자별 읽지 않은 알림 조회
CREATE INDEX idx_notifications_user_unread
    ON notifications (user_id, is_read, created_at DESC);

-- 읽지 않은 알림 수 집계용
CREATE INDEX idx_notifications_user_unread_count
    ON notifications (user_id)
    WHERE is_read = FALSE;
```

### refresh_tokens 테이블 인덱스

```sql
-- 토큰 유니크 인덱스
CREATE UNIQUE INDEX idx_refresh_tokens_token
    ON refresh_tokens (token);

-- 사용자별 토큰 만료일
CREATE INDEX idx_refresh_tokens_user_expires
    ON refresh_tokens (user_id, expires_at);

-- 만료된 토큰 정리용
CREATE INDEX idx_refresh_tokens_expires
    ON refresh_tokens (expires_at)
    WHERE is_revoked = FALSE;
```

### schedules 테이블 인덱스

```sql
-- 사용자별 일정 날짜 내림차순
CREATE INDEX idx_schedules_user_date_desc
    ON schedules (user_id, schedule_date DESC);

-- 날짜별 일정 조회
CREATE INDEX idx_schedules_date
    ON schedules (schedule_date);

-- 생성일 인덱스
CREATE INDEX idx_schedules_created_at
    ON schedules (created_at);

-- 공개 일정만 조회
CREATE INDEX idx_schedules_public
    ON schedules (schedule_date DESC)
    WHERE is_public = TRUE AND deleted_at IS NULL;
```

### schedule_likes 테이블 인덱스

```sql
-- 일정별 사용자별 좋아요 유니크 제약 (중복 좋아요 방지)
CREATE UNIQUE INDEX idx_schedule_likes_schedule_user
    ON schedule_likes (schedule_id, user_id);

-- 사용자별 좋아요 목록 조회
CREATE INDEX idx_schedule_likes_user_id
    ON schedule_likes (user_id, created_at DESC);
```

### schedule_comments 테이블 인덱스

```sql
-- 일정별 댓글 생성일 순
CREATE INDEX idx_schedule_comments_schedule_created
    ON schedule_comments (schedule_id, created_at);

-- 사용자별 댓글 조회
CREATE INDEX idx_schedule_comments_user_id
    ON schedule_comments (user_id);

-- 부모 댓글 ID (대댓글 조회)
CREATE INDEX idx_schedule_comments_parent_id
    ON schedule_comments (parent_id);

-- 삭제되지 않은 댓글만 조회
CREATE INDEX idx_schedule_comments_not_deleted
    ON schedule_comments (schedule_id, created_at)
    WHERE deleted_at IS NULL;
```

---

## 외래 키 생성

```sql
-- user_settings 외래 키
ALTER TABLE user_settings
    ADD CONSTRAINT fk_user_settings_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- categories 외래 키
ALTER TABLE categories
    ADD CONSTRAINT fk_categories_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- budgets 외래 키
ALTER TABLE budgets
    ADD CONSTRAINT fk_budgets_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE budgets
    ADD CONSTRAINT fk_budgets_category_id
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE;

-- transactions 외래 키
ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_category_id
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

ALTER TABLE transactions
    ADD CONSTRAINT fk_transactions_card_id
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL;

-- cards 외래 키
ALTER TABLE cards
    ADD CONSTRAINT fk_cards_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- daily_life_entries 외래 키
ALTER TABLE daily_life_entries
    ADD CONSTRAINT fk_daily_life_entries_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- daily_life_images 외래 키
ALTER TABLE daily_life_images
    ADD CONSTRAINT fk_daily_life_images_entry_id
    FOREIGN KEY (entry_id) REFERENCES daily_life_entries(id) ON DELETE CASCADE;

-- daily_life_tags 외래 키
ALTER TABLE daily_life_tags
    ADD CONSTRAINT fk_daily_life_tags_entry_id
    FOREIGN KEY (entry_id) REFERENCES daily_life_entries(id) ON DELETE CASCADE;

-- daily_life_likes 외래 키
ALTER TABLE daily_life_likes
    ADD CONSTRAINT fk_daily_life_likes_entry_id
    FOREIGN KEY (entry_id) REFERENCES daily_life_entries(id) ON DELETE CASCADE;

ALTER TABLE daily_life_likes
    ADD CONSTRAINT fk_daily_life_likes_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- daily_life_comments 외래 키
ALTER TABLE daily_life_comments
    ADD CONSTRAINT fk_daily_life_comments_entry_id
    FOREIGN KEY (entry_id) REFERENCES daily_life_entries(id) ON DELETE CASCADE;

ALTER TABLE daily_life_comments
    ADD CONSTRAINT fk_daily_life_comments_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE daily_life_comments
    ADD CONSTRAINT fk_daily_life_comments_parent_id
    FOREIGN KEY (parent_id) REFERENCES daily_life_comments(id) ON DELETE CASCADE;

-- notifications 외래 키
ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- refresh_tokens 외래 키
ALTER TABLE refresh_tokens
    ADD CONSTRAINT fk_refresh_tokens_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- schedules 외래 키
ALTER TABLE schedules
    ADD CONSTRAINT fk_schedules_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- schedule_likes 외래 키
ALTER TABLE schedule_likes
    ADD CONSTRAINT fk_schedule_likes_schedule_id
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE;

ALTER TABLE schedule_likes
    ADD CONSTRAINT fk_schedule_likes_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- schedule_comments 외래 키
ALTER TABLE schedule_comments
    ADD CONSTRAINT fk_schedule_comments_schedule_id
    FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE;

ALTER TABLE schedule_comments
    ADD CONSTRAINT fk_schedule_comments_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE schedule_comments
    ADD CONSTRAINT fk_schedule_comments_parent_id
    FOREIGN KEY (parent_id) REFERENCES schedule_comments(id) ON DELETE CASCADE;
```

---

## 함수 및 트리거

### 1. updated_at 자동 갱신 함수

```sql
-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. updated_at 트리거 생성

```sql
-- users 테이블 트리거
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- user_settings 테이블 트리거
CREATE TRIGGER trigger_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- categories 테이블 트리거
CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- budgets 테이블 트리거
CREATE TRIGGER trigger_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- transactions 테이블 트리거
CREATE TRIGGER trigger_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- cards 테이블 트리거
CREATE TRIGGER trigger_cards_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- daily_life_entries 테이블 트리거
CREATE TRIGGER trigger_daily_life_entries_updated_at
    BEFORE UPDATE ON daily_life_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- daily_life_comments 테이블 트리거
CREATE TRIGGER trigger_daily_life_comments_updated_at
    BEFORE UPDATE ON daily_life_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- schedules 테이블 트리거
CREATE TRIGGER trigger_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- schedule_comments 테이블 트리거
CREATE TRIGGER trigger_schedule_comments_updated_at
    BEFORE UPDATE ON schedule_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. 좋아요/댓글 카운터 업데이트 함수

```sql
-- 좋아요 추가 시 카운터 증가
CREATE OR REPLACE FUNCTION increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE daily_life_entries
    SET likes_count = likes_count + 1
    WHERE id = NEW.entry_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 좋아요 삭제 시 카운터 감소
CREATE OR REPLACE FUNCTION decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE daily_life_entries
    SET likes_count = likes_count - 1
    WHERE id = OLD.entry_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 댓글 추가 시 카운터 증가
CREATE OR REPLACE FUNCTION increment_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NULL THEN
        UPDATE daily_life_entries
        SET comments_count = comments_count + 1
        WHERE id = NEW.entry_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 댓글 삭제 시 카운터 감소 (소프트 삭제)
CREATE OR REPLACE FUNCTION update_comments_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        UPDATE daily_life_entries
        SET comments_count = comments_count - 1
        WHERE id = NEW.entry_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 4. 카운터 트리거 생성

```sql
-- 좋아요 트리거
CREATE TRIGGER trigger_increment_likes
    AFTER INSERT ON daily_life_likes
    FOR EACH ROW
    EXECUTE FUNCTION increment_likes_count();

CREATE TRIGGER trigger_decrement_likes
    AFTER DELETE ON daily_life_likes
    FOR EACH ROW
    EXECUTE FUNCTION decrement_likes_count();

-- 댓글 트리거
CREATE TRIGGER trigger_increment_comments
    AFTER INSERT ON daily_life_comments
    FOR EACH ROW
    EXECUTE FUNCTION increment_comments_count();

CREATE TRIGGER trigger_update_comments_on_delete
    AFTER UPDATE ON daily_life_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_comments_count_on_delete();
```

### 5. 일정 좋아요/댓글 카운터 함수

```sql
-- 일정 좋아요 추가 시 카운터 증가
CREATE OR REPLACE FUNCTION increment_schedule_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE schedules
    SET likes_count = likes_count + 1
    WHERE id = NEW.schedule_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 일정 좋아요 삭제 시 카운터 감소
CREATE OR REPLACE FUNCTION decrement_schedule_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE schedules
    SET likes_count = likes_count - 1
    WHERE id = OLD.schedule_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 일정 댓글 추가 시 카운터 증가
CREATE OR REPLACE FUNCTION increment_schedule_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NULL THEN
        UPDATE schedules
        SET comments_count = comments_count + 1
        WHERE id = NEW.schedule_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 일정 댓글 삭제 시 카운터 감소 (소프트 삭제)
CREATE OR REPLACE FUNCTION update_schedule_comments_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        UPDATE schedules
        SET comments_count = comments_count - 1
        WHERE id = NEW.schedule_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 6. 일정 카운터 트리거 생성

```sql
-- 일정 좋아요 트리거
CREATE TRIGGER trigger_increment_schedule_likes
    AFTER INSERT ON schedule_likes
    FOR EACH ROW
    EXECUTE FUNCTION increment_schedule_likes_count();

CREATE TRIGGER trigger_decrement_schedule_likes
    AFTER DELETE ON schedule_likes
    FOR EACH ROW
    EXECUTE FUNCTION decrement_schedule_likes_count();

-- 일정 댓글 트리거
CREATE TRIGGER trigger_increment_schedule_comments
    AFTER INSERT ON schedule_comments
    FOR EACH ROW
    EXECUTE FUNCTION increment_schedule_comments_count();

CREATE TRIGGER trigger_update_schedule_comments_on_delete
    AFTER UPDATE ON schedule_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_schedule_comments_count_on_delete();
```

---

## Materialized View

### 1. 월별 카테고리 통계

```sql
CREATE MATERIALIZED VIEW mv_monthly_category_stats AS
SELECT
    t.user_id,
    t.category_id,
    c.name AS category_name,
    c.type AS category_type,
    DATE_TRUNC('month', t.transaction_date) AS month,
    t.type AS transaction_type,
    SUM(t.amount) AS total_amount,
    COUNT(*) AS transaction_count,
    AVG(t.amount) AS avg_amount,
    MIN(t.amount) AS min_amount,
    MAX(t.amount) AS max_amount
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.deleted_at IS NULL
GROUP BY
    t.user_id,
    t.category_id,
    c.name,
    c.type,
    DATE_TRUNC('month', t.transaction_date),
    t.type;

-- 유니크 인덱스 생성
CREATE UNIQUE INDEX idx_mv_monthly_category_stats
    ON mv_monthly_category_stats (user_id, category_id, month, transaction_type);

-- 일반 인덱스 생성
CREATE INDEX idx_mv_monthly_category_stats_user_month
    ON mv_monthly_category_stats (user_id, month);

-- Materialized View 갱신 함수 (매일 새벽 1시 실행 권장)
CREATE OR REPLACE FUNCTION refresh_monthly_category_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_category_stats;
END;
$$ LANGUAGE plpgsql;
```

### 2. 일별 지출 추이

```sql
CREATE MATERIALIZED VIEW mv_daily_spending_trend AS
SELECT
    user_id,
    transaction_date,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS daily_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS daily_income,
    COUNT(CASE WHEN type = 'expense' THEN 1 END) AS expense_count,
    COUNT(CASE WHEN type = 'income' THEN 1 END) AS income_count
FROM transactions
WHERE deleted_at IS NULL
GROUP BY user_id, transaction_date;

-- 유니크 인덱스 생성
CREATE UNIQUE INDEX idx_mv_daily_spending_user_date
    ON mv_daily_spending_trend (user_id, transaction_date DESC);

-- Materialized View 갱신 함수
CREATE OR REPLACE FUNCTION refresh_daily_spending_trend()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_spending_trend;
END;
$$ LANGUAGE plpgsql;
```

### 3. 카드사별 결제 금액

```sql
CREATE MATERIALIZED VIEW mv_card_spending AS
SELECT
    t.user_id,
    c.company AS card_company,
    DATE_TRUNC('month', t.transaction_date) AS month,
    SUM(t.amount) AS total_amount,
    COUNT(*) AS transaction_count
FROM transactions t
JOIN cards c ON t.card_id = c.id
WHERE t.deleted_at IS NULL AND t.type = 'expense'
GROUP BY t.user_id, c.company, DATE_TRUNC('month', t.transaction_date);

-- 인덱스 생성
CREATE INDEX idx_mv_card_spending_user_month
    ON mv_card_spending (user_id, month);

-- Materialized View 갱신 함수
CREATE OR REPLACE FUNCTION refresh_card_spending()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_card_spending;
END;
$$ LANGUAGE plpgsql;
```

---

## Row Level Security

### 1. RLS 활성화

```sql
-- transactions 테이블 RLS 활성화
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- daily_life_entries 테이블 RLS 활성화
ALTER TABLE daily_life_entries ENABLE ROW LEVEL SECURITY;

-- notifications 테이블 RLS 활성화
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### 2. RLS 정책 생성

```sql
-- 사용자는 자신의 거래만 조회/수정/삭제 가능
CREATE POLICY policy_transactions_user_access ON transactions
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::BIGINT);

-- 사용자는 자신의 일상 기록만 조회/수정/삭제 가능 (공개 게시물은 모두 조회)
CREATE POLICY policy_daily_life_user_access ON daily_life_entries
    FOR ALL
    USING (
        user_id = current_setting('app.current_user_id')::BIGINT
        OR is_private = FALSE
    );

-- 사용자는 자신의 알림만 조회/수정 가능
CREATE POLICY policy_notifications_user_access ON notifications
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::BIGINT);

-- 현재 사용자 ID 설정 함수
CREATE OR REPLACE FUNCTION set_current_user_id(p_user_id BIGINT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user_id', p_user_id::TEXT, false);
END;
$$ LANGUAGE plpgsql;
```

---

## 초기 데이터

### 1. 기본 카테고리 데이터

```sql
-- 지출 카테고리
INSERT INTO categories (user_id, name, type, color, icon, is_default, display_order) VALUES
(NULL, '식비', 'expense', '#FF6B6B', 'utensils', TRUE, 1),
(NULL, '교통', 'expense', '#4ECDC4', 'car', TRUE, 2),
(NULL, '쇼핑', 'expense', '#95E1D3', 'shopping-bag', TRUE, 3),
(NULL, '문화', 'expense', '#F38181', 'film', TRUE, 4),
(NULL, '의료', 'expense', '#AA96DA', 'heart-pulse', TRUE, 5),
(NULL, '교육', 'expense', '#FCBAD3', 'book', TRUE, 6),
(NULL, '주거', 'expense', '#A8D8EA', 'home', TRUE, 7),
(NULL, '통신', 'expense', '#FFD93D', 'smartphone', TRUE, 8),
(NULL, '기타', 'expense', '#C8C8C8', 'more-horizontal', TRUE, 9);

-- 수입 카테고리
INSERT INTO categories (user_id, name, type, color, icon, is_default, display_order) VALUES
(NULL, '급여', 'income', '#6BCF7F', 'briefcase', TRUE, 1),
(NULL, '용돈', 'income', '#51CF66', 'gift', TRUE, 2),
(NULL, '부수입', 'income', '#94D82D', 'trending-up', TRUE, 3),
(NULL, '기타', 'income', '#C8C8C8', 'more-horizontal', TRUE, 4);
```

### 2. 테스트 사용자 데이터

```sql
-- 테스트 사용자 생성 (비밀번호: password123)
INSERT INTO users (name, email, password_hash, email_verified, is_active) VALUES
('테스트 사용자', 'test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5UpzCDNjdQvpC', TRUE, TRUE);

-- 테스트 사용자 설정 생성
INSERT INTO user_settings (user_id, budget_alerts, daily_reminders, weekly_reports) VALUES
(1, TRUE, TRUE, TRUE);
```

---

## 파티셔닝 예시

### transactions 테이블 월별 파티셔닝 (선택사항)

```sql
-- 기존 테이블을 파티션 테이블로 변환하려면 재생성 필요
-- 아래는 새로 생성 시 적용 예시

-- 1. 파티션 마스터 테이블 생성
CREATE TABLE transactions_partitioned (
    LIKE transactions INCLUDING ALL
) PARTITION BY RANGE (transaction_date);

-- 2. 월별 파티션 생성 (2025년 예시)
CREATE TABLE transactions_2025_01 PARTITION OF transactions_partitioned
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE transactions_2025_02 PARTITION OF transactions_partitioned
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE transactions_2025_03 PARTITION OF transactions_partitioned
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- ... 필요한 만큼 생성

-- 3. 기본 파티션 (범위 외 데이터)
CREATE TABLE transactions_default PARTITION OF transactions_partitioned
    DEFAULT;
```

---

## 데이터베이스 유지보수

### 1. VACUUM 및 ANALYZE

```sql
-- 정기적으로 실행 (주 1회 권장)
VACUUM ANALYZE users;
VACUUM ANALYZE transactions;
VACUUM ANALYZE daily_life_entries;

-- 전체 데이터베이스 VACUUM
VACUUM ANALYZE;
```

### 2. 만료된 리프레시 토큰 삭제

```sql
-- 만료된 토큰 삭제 (배치 작업)
DELETE FROM refresh_tokens
WHERE expires_at < CURRENT_TIMESTAMP
AND is_revoked = FALSE;
```

### 3. 오래된 소프트 삭제 데이터 하드 삭제

```sql
-- 30일 이상 된 소프트 삭제 데이터 하드 삭제
DELETE FROM users
WHERE deleted_at IS NOT NULL
AND deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

DELETE FROM transactions
WHERE deleted_at IS NOT NULL
AND deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

DELETE FROM daily_life_entries
WHERE deleted_at IS NOT NULL
AND deleted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
```

### 4. 읽은 알림 자동 삭제

```sql
-- 30일 이상 된 읽은 알림 삭제
DELETE FROM notifications
WHERE is_read = TRUE
AND read_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
```

---

## 권한 설정

```sql
-- 애플리케이션 사용자 생성
CREATE USER smart_budget_app WITH PASSWORD 'your_secure_password_here';

-- 데이터베이스 접근 권한
GRANT CONNECT ON DATABASE smart_budget_db TO smart_budget_app;

-- 스키마 사용 권한
GRANT USAGE ON SCHEMA public TO smart_budget_app;

-- 테이블 권한
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO smart_budget_app;

-- 시퀀스 권한
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO smart_budget_app;

-- 함수 실행 권한
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO smart_budget_app;

-- Materialized View 권한
GRANT SELECT ON mv_monthly_category_stats TO smart_budget_app;
GRANT SELECT ON mv_daily_spending_trend TO smart_budget_app;
GRANT SELECT ON mv_card_spending TO smart_budget_app;
```

---

## 실행 순서

위 DDL 스크립트를 실행할 때는 다음 순서를 따르세요:

1. **데이터베이스 생성**
2. **테이블 생성** (1번부터 13번까지 순서대로)
3. **인덱스 생성**
4. **외래 키 생성**
5. **함수 및 트리거 생성**
6. **Materialized View 생성**
7. **Row Level Security 설정** (선택사항)
8. **초기 데이터 삽입**
9. **권한 설정**

---

**작성일**: 2025-08-14
**작성자**: Database Team
**버전**: 1.0
