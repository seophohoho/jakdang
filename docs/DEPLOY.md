# 배포 기록

상태: **배포 진행 중** (2026-10-22 기준). 저장소·Vercel 프로젝트·운영 DB를 만들었고 첫 배포 전이다. 비밀 값은 적지 않는다.

## 기록

| 항목 | 값 |
| --- | --- |
| 배포 URL | 미기록 |
| Git 저장소 | GitHub `seophohoho/jakdang` (비공개, 2026-10-22 생성) |
| Vercel 프로젝트 / 플랜 | `seophohoho/jakdang` / Hobby. Git 연결됨. Framework Other, Node.js 24.x, 함수 지역 기본값(iad1) |
| Neon 프로젝트 | `jakdang` (`twilight-fog-60399452`), `aws-us-east-1`, Postgres 17, 기본 브랜치 `main`, DB `jakdang`. 무료 플랜 |
| Node 버전 | 24.x (`package.json` engines, `.nvmrc`) — 플랫폼 빌드 로그 확인 미기록 |
| Cron 일정 | `0 0 * * *` UTC (한국 시간 오전 9시대, 정각 보장 없음) |
| 함수 시간 제한 | `api/cron.ts` 240초, `api/health.ts` 30초, 내부 예산 `RUN_BUDGET_MS=210000` |
| 계정의 현재 Cron·함수 한도 | 미기록 |
| 비밀 변수 이름(Production) | `DATABASE_URL`, `CRON_SECRET`, `DISCORD_WEBHOOK_URL`, `MATTERMOST_WEBHOOK_URL` |
| 일반 변수(Production) | `NOTIFICATIONS_ENABLED`, `MAX_NOTIFICATIONS_PER_RUN`, `RUN_BUDGET_MS`, `LOG_LEVEL` |
| Preview 변수 | 운영 비밀 공유 안 함. 알림은 코드에서 강제로 끔(`VERCEL_ENV=preview`) |
| 마이그레이션 버전 | `001_init` 적용 (2026-10-22, 로컬에서 1회). 재실행 시 "이미 적용됨" 확인 |
| 비인증 401 확인 | 미확인 |
| bootstrap 결과 | 미실행 |
| 인증된 cron 수동 실행 | 미실행 |
| 연결 테스트 메시지 | 미실행 |
| 다음 날 자동 실행 확인 | 미확인 |

## 로컬에서 확인한 것 (2026-10-22)

- `vercel@65.0.0 build`를 로컬에서 실행했다. `.vercel/project.json`은 임시로 만들었고, 계정 연결은 없었다. 결과:
  - `api/cron.func`: `runtime: nodejs24.x`, `maxDuration: 240`
  - `api/health.func`: `maxDuration: 30`
  - `crons`: `/api/cron` `0 0 * * *` 1개
  - 정적 산출물: `public/robots.txt` 하나뿐이다. 소스·문서는 공개 경로로 나가지 않는다(`outputDirectory: public`).
  - 빌드된 `cron.func`를 Node로 직접 불러 비인증 요청을 보냈고 401을 받았다.
- 실제 Vercel 프로젝트의 빌드 로그에서도 같은 내용을 다시 확인해야 한다.

## 배포 순서

1. **로컬 검증**
   - `npm ci && npm run typecheck && npm run test && npm run db:up && npm run test:integration && npm run build`
   - 플랫폼 빌드 검증으로 `npx vercel build`도 실행한다.
2. **저장소**
   - 비공개 Git 저장소를 준비한다.
   - `git ls-files`에 `.env*`(`.env.example` 제외)와 `.vercel`이 없는지 확인한다.
3. **Neon 운영 DB**
   - 프로젝트를 만든다. 기본 브랜치를 운영용으로 쓴다. 개발 DB는 로컬 Docker(`jakdang_dev`)라 Neon 개발 브랜치는 만들지 않는다.
   - 운영 pooled 연결 주소(`...-pooler...`)를 받는다.
   - `sslmode`는 `verify-full`로 바꾼다. Neon이 주는 `sslmode=require`는 pg 8에서 경고를 낸다. pg 9부터는 인증서를 검사하지 않는 약한 모드로 바뀐다.
     - `neonctl`을 쓰면 주소를 화면에 출력하지 않고 파일에 바로 쓸 수 있다: `neonctl connection-string <브랜치> --project-id <id> --pooled`의 출력을 스크립트로 받아 `.env.production.local`에 쓴다.
   - 운영 값은 `.env.production.local`에 둔다(`.env*`라 ignore됨). 셸 이력·명령 인자에 비밀을 넣지 않는다.
   - 마이그레이션은 로컬에서 한 번만 적용한다. 빌드나 요청마다 실행하지 않는다.
     ```bash
     npm run db:migrate -- --env-path .env.production.local
     ```
   - `--env-path`을 주면 그 파일만 읽고 개발용 `.env`는 읽지 않는다.
   - 재실행해도 `schema_migrations`가 이미 적용됨으로 건너뛴다.
4. **Vercel 프로젝트**
   - 저장소를 연결한다. Framework는 Other, Node.js는 24.x다.
   - Build/Output 설정은 `vercel.json`을 따른다(`npm run build`, `public`).
5. **환경 변수**
   - Production에 아래 값을 등록한다.
     - `DATABASE_URL`(Neon 운영 pooled)
     - `CRON_SECRET`(`openssl rand -hex 32`)
     - `DISCORD_WEBHOOK_URL`, `MATTERMOST_WEBHOOK_URL`
     - `NOTIFICATIONS_ENABLED=false`
   - Preview에는 운영 DB·Webhook을 넣지 않는다.
6. **프로덕션 배포 후 비인증 확인**
   - `curl -s -o /dev/null -w '%{http_code}' https://<배포>/api/cron` → 401
   - `curl -s -o /dev/null -w '%{http_code}' https://<배포>/api/health` → 401
7. **bootstrap**
   - 로컬에서 운영 DB로 `npm run sync -- --bootstrap --env-path .env.production.local`을 1회 실행한다.
   - 그동안 Cron이 돌아도 같은 `sync` 잠금 때문에 겹치지 않는다(나중 실행은 `skipped`).
   - `initialized_at`이 3개 소스 모두에 찍혔는지 확인한다.
8. **인증된 cron 수동 실행**
   - `.env.production.local`에 `JAKDANG_BASE_URL`·`CRON_SECRET`을 넣는다.
   - `npm run api:call -- --path cron --env-path .env.production.local`
   - 이어서 `--path health`로 `job_runs`, 수집 결과, pending 알림을 확인한다. 아직 발송은 꺼져 있다.
9. **알림 켜기**
   - Production `NOTIFICATIONS_ENABLED=true`로 바꾸고 재배포한다.
   - 로컬에서 `npm run notifications:test -- --destination discord-main --env-path .env.production.local`을 실행하고, `mattermost-main`도 1건 보낸다.
   - 결과는 화면·로그로만 확인한다(DB 기록 없음).
10. **Cron 활성 확인**
    - 다음 날 `health`의 `lastRun`과 Vercel 대시보드 Cron 실행 기록을 확인한다.
    - 실패하면 플랫폼 로그도 본다.
11. **이 문서의 "기록" 표를 채운다.**

## 주의

- 유료 플랜 구매, 기존 프로젝트 삭제, 운영 DB 초기화는 별도 승인 없이 하지 않는다.
- 통합 테스트를 운영 DB에 돌리지 않는다. `TEST_DATABASE_URL`의 DB 이름에 `test`가 없으면 테스트가 초기화를 거부한다.
- 재배포는 DB를 건드리지 않는다. `source_state`·`source_items`·`notifications`는 Neon에 남는다.
