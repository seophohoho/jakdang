# jakdang — 국내 개발자 행사 공고 알림 봇

하루 한 번 공개 목록 3곳을 읽습니다. 새 공고가 있으면 **제목과 링크**를 Discord와 Mattermost에 보냅니다.

- 행사 날짜·장소 추출, LLM, 변경 알림, 마감 리마인더는 하지 않습니다.
- 수집처는 [docs/SOURCES.md](docs/SOURCES.md)에 정리돼 있습니다.
- 국내 개발자 행사 전체를 포괄하지 않습니다. 컨퍼런스·밋업·세미나 커버리지는 약합니다.
- 정확히 한 번 전송을 보장하지 않습니다. 전달 여부가 불명확한 알림은 `uncertain`으로 남기고 사람이 확인합니다.
- 배포 대상은 Vercel 함수 + Vercel Cron + Neon Postgres입니다. 상시 서버, Next.js, 관리자 화면은 없습니다.

## 요구 사항

- Node.js 24 (`.nvmrc`). `nvm use`로 맞춥니다.
  - `~/.npmrc`에 `prefix=` 설정이 있으면 `nvm use`가 거부됩니다.
  - 그때는 `nvm use --delete-prefix 24`를 쓰거나(전역 설정이 바뀌니 직접 판단), PATH에 `~/.nvm/versions/node/v24.*/bin`을 앞에 둡니다.
- npm (package-lock.json 커밋됨)
- 개발·테스트 DB용 Docker. `compose.yaml`의 Postgres 17이며 포트는 `127.0.0.1:54329`입니다.

## 빠른 시작 (로컬)

```bash
nvm use
npm ci
npm run db:up
cp .env.example .env
npm run db:migrate
npm run sources:check
npm run sync -- --dry-run
npm run sync -- --bootstrap
npm run sync
```

`cp` 다음에 `.env`의 DATABASE_URL을 `postgres://jakdang:jakdang@localhost:54329/jakdang_dev`로 바꿔야 합니다. Docker의 jakdang_dev DB를 가리키는 주소입니다.

Webhook 주소를 비워 두면 알림 행(notification)을 만들지 않습니다. 개발 중 실제 채널로 보내지 않으려면 `NOTIFICATIONS_ENABLED=false`를 유지합니다.

## 명령과 부작용

| 명령 | 외부 사이트 요청 | DB 쓰기 | 잠금·실행 기록 | Webhook 호출 |
| --- | --- | --- | --- | --- |
| `npm run typecheck` / `npm run build` | 없음 | 없음 | 없음 | 없음 |
| `npm run test` | 없음(외부 네트워크 차단) | 없음 | 없음 | 없음 |
| `npm run test:integration` | 없음 | **테스트 DB 초기화** | 테스트 DB | 로컬 모의 서버만 |
| `npm run db:migrate` | 없음 | 스키마 생성(재실행 안전) | 마이그레이션 기록 | 없음 |
| `npm run sources:check` | 목록 페이지 | 없음 | 없음 | 없음 |
| `npm run sync -- --dry-run` | 목록 페이지 | 없음(읽기 전용 비교) | 없음 | 없음 |
| `npm run sync -- --bootstrap [--source <id>]` | 최대 탐색 범위까지 | 항목을 `is_baseline`으로 저장, `initialized_at` 기록 | 있음 | 없음 |
| `npm run sync` | 평소 범위 | 항목·알림 저장, 상태 갱신 | 있음 | 켜져 있으면 실행당 한도 내 |
| `npm run notifications:flush` | 없음 | 알림 상태 갱신 | 알림 claim만 | 켜져 있으면 한도 내(재시도 예약분 포함) |
| `npm run notifications:resolve -- --id <id> --action retry\|sent` | 없음 | 알림 1건 상태 변경 | 없음 | 없음 |
| `npm run notifications:test -- --destination discord-main\|mattermost-main` | 없음 | 없음 | 없음 | **합성 메시지 1건** |
| `npm run api:call -- --path cron\|health [--env-path <파일>]` | 배포된 API | 배포 환경에 따름 | cron이면 있음 | cron이면 있음 |

모든 CLI 명령과 `db:migrate`는 `--env-path <파일>`을 받습니다. 주면 개발용 `.env` 대신 그 파일만 읽습니다(예: `.env.production.local`).

명령별 세부 동작:

- **`--dry-run`**
  - 수집 결과와 예상 알림을 출력합니다. DB가 설정돼 있으면 읽기 전용 트랜잭션으로 비교만 합니다.
  - 잠금, 실행 기록, Webhook 호출은 없습니다.
- **`--bootstrap`**
  - 로컬에서 수동으로 실행합니다. 작업 시간 한도 없이 SOURCES.md의 최대 범위까지 읽습니다.
  - 알림은 만들지 않습니다. 모든 페이지를 문제없이 읽은 소스에만 `initialized_at`을 기록합니다.
  - cron은 `initialized_at`이 없는 소스를 건너뜁니다. 첫 실행이 실패한 소스나 나중에 추가한 소스는 `--source <id>`로 다시 실행합니다.
- **`sync`**
  - 처리 순서: 끊긴 전송 복구 → 기존 미발송 알림 일부 발송 → 수집·저장 → 남은 한도 발송
  - 다른 실행이 잠금을 가지고 있으면 `skipped` 기록만 남깁니다.
- **`notifications:flush`**
  - `NOTIFICATIONS_ENABLED=false`면 보내지 않습니다.
  - 재시도 예약 시각이 아직 오지 않은 알림도 바로 시도합니다. 빠른 복구용입니다.
- **`notifications:resolve`**: `uncertain`·`failed` 알림만 처리합니다.
  - `retry`: `pending`으로 되돌리고 시도 횟수를 초기화합니다.
  - `sent`: 전송 완료로 기록합니다.
  - `--id`에는 알림 UUID 또는 8자 이상 앞부분을 넣습니다.
- **`notifications:test`**
  - `NOTIFICATIONS_ENABLED`와 관계없이 명시적으로 1건을 보냅니다.
  - 결과는 화면과 로그에만 남고 DB는 건드리지 않습니다.
- **`api:call`**
  - `JAKDANG_BASE_URL`(https 배포 주소)과 `CRON_SECRET`을 환경 변수나 `--env-path` 파일에서 읽어 Authorization 헤더로 보냅니다.
  - 비밀을 명령 인자나 URL에 넣지 않습니다.

## 환경 변수

| 이름 | 기본값 | 설명 |
| --- | --- | --- |
| `DATABASE_URL` | 없음 | Postgres 주소. 운영은 Neon pooled URL(`sslmode=verify-full`) |
| `CRON_SECRET` | 없음 | 32자 이상 난수(`openssl rand -hex 32`). 없거나 짧으면 API가 모두 401 |
| `NOTIFICATIONS_ENABLED` | `false` | `true`/`false` 문자열만 허용. preview·development 배포에서는 항상 꺼짐 |
| `DISCORD_WEBHOOK_URL` | 없음 | `discord-main` 채널. `https://discord.com/api/webhooks/...` |
| `MATTERMOST_WEBHOOK_URL` | 없음 | `mattermost-main` 채널. `http(s)://<서버>/hooks/...` |
| `MAX_NOTIFICATIONS_PER_RUN` | `10` | 실행당 발송 시도 알림 행 수. 채널 2개면 공고 5건 분량 |
| `RUN_BUDGET_MS` | `210000` | cron 실행 작업 예산(최대 230000). 함수 제한 240초보다 짧게 |
| `LOG_LEVEL` | `info` | `debug`/`info`/`warn`/`error` |
| `JAKDANG_BASE_URL` | 없음 | `api:call` 스크립트 전용 배포 주소 |
| `TEST_DATABASE_URL` | Docker `jakdang_test` | 통합 테스트 DB. DB 이름에 `test`가 단어로 들어가야 초기화 허용 |

비밀 취급 원칙:

- 비밀 없는 `.env.example`만 커밋합니다. `.env*`와 `.vercel`은 ignore됩니다.
- 로그·health·cron 응답에서 Webhook URL, DB 주소, Bearer 토큰은 마스킹됩니다.

## 테스트

```bash
npm run typecheck
npm run test
npm run db:up
npm run test:integration
npm run build
```

- 단위 테스트는 loopback(내 컴퓨터 자신을 가리키는 주소) 외 모든 TCP 연결을 막습니다.
- 통합 테스트는 실제 Postgres에서 제약, 트랜잭션, 동시 잠금, claim, 발송 상태 전이, cron·health 핸들러를 검증합니다.
- 수집처 파서는 `tests/fixtures`의 실제 페이지 축약본과 합성 fixture로 검증합니다. 실제 사이트 검증은 `npm run sources:check`로 따로 합니다.

## 저장소 구조

```text
api/cron.ts, api/health.ts   Vercel 함수(GET 전용, Bearer 인증)
src/config.ts                환경 변수 검증
src/sources.ts               운영 소스 설정 3개
src/core/                    runSync, 수집, 정규화·신규 판정, 발송, 임대 잠금
src/collectors/              안전한 fetch, HTML/RSS 파서, 사이트 어댑터
src/notifications/           메시지 템플릿, Discord/Mattermost Webhook
src/db/                      pg 연결, 마이그레이션, 저장소 함수
src/commands/, src/cli.ts    CLI
migrations/001_init.sql      스키마
docs/                        SOURCES / DEPLOY / OPERATIONS
```

## 플랫폼 조건과 한도

계획 기준(2026-10-21 공식 문서 확인)입니다. 요금·무료 한도는 보장하지 않습니다.

- Vercel Hobby Cron은 작업마다 하루 1회입니다. 해당 시간대 안에서 실행 시각이 달라질 수 있습니다.
  - `0 0 * * *`(UTC)는 한국 시간 오전 9시대를 뜻할 뿐, 9시 정각을 약속하지 않습니다.
- 함수 `maxDuration`은 240초입니다. 내부 작업 예산은 210초입니다.
- 하루 1회 실행이라 재시도 예약이 1분 뒤여도 자동 처리는 다음 날이 될 수 있습니다. 빠른 복구는 로컬 `notifications:flush`로 합니다.
- 실제 배포 계정의 현재 한도(2026-10-22 확인): Vercel Hobby, 함수 기본 제한 300초(이 프로젝트는 240초로 지정), Fluid compute 켜짐, 지역 iad1. Neon 무료 플랜, `aws-us-east-1`. 자세한 내용은 [docs/DEPLOY.md](docs/DEPLOY.md)에 있습니다.
- 현재 운영 알림 채널은 Mattermost 하나입니다. Discord는 보류 중입니다.
