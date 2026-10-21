# 배포 기록

상태: **운영 배포됨, Mattermost만 발송** (2026-10-22 03시 KST 기준). Discord는 사용자 결정으로 보류했다. 예약 Cron의 첫 자동 실행은 아직 확인하지 못했다. 비밀 값은 적지 않는다.

## 기록

시각은 한국 시간(KST)이다.

| 항목 | 값 |
| --- | --- |
| 배포 URL | `https://jakdang-flax.vercel.app` (운영 별칭. `jakdang.vercel.app`은 이미 사용 중이었다) |
| Git 저장소 | GitHub `seophohoho/jakdang` (비공개, 2026-10-22 생성) |
| Vercel 프로젝트 / 플랜 | `seophohoho/jakdang` / Hobby. Git 연결됨. Framework Other, Node.js 24.x, 함수 지역 기본값(iad1) |
| Neon 프로젝트 | `jakdang` (`twilight-fog-60399452`), `aws-us-east-1`, Postgres 17, 기본 브랜치 `main`, DB `jakdang`. 무료 플랜 |
| Node 버전 | 24.x. 배포 API의 `projectSettings.nodeVersion`으로 확인. 빌드 로그에는 Node 버전이 찍히지 않는다 |
| Cron 일정 | `0 0 * * *` UTC (한국 시간 오전 9시대, 정각 보장 없음). 프로젝트 Cron 활성(2026-10-22 02:55) |
| 함수 시간 제한 | 배포 API에서 확인: `api/cron.ts` 240초, `api/health.ts` 30초. 내부 예산 `RUN_BUDGET_MS=210000` |
| 계정의 현재 Cron·함수 한도 | Hobby. 프로젝트 API 기준 함수 기본 제한 300초(`functionDefaultTimeout`), Fluid compute 켜짐, 메모리 standard, 지역 iad1. Cron 개수·빈도 한도는 API에 나오지 않는다(계획 기준: Hobby는 작업당 하루 1회) |
| 비밀 변수 이름(Production) | `DATABASE_URL`, `CRON_SECRET`, `MATTERMOST_WEBHOOK_URL`. `DISCORD_WEBHOOK_URL`은 미등록(보류) |
| 일반 변수(Production) | `NOTIFICATIONS_ENABLED`(03:01부터 `true`), `MAX_NOTIFICATIONS_PER_RUN`, `RUN_BUDGET_MS`, `LOG_LEVEL`. CLI로 넣었고 모두 sensitive 타입으로 저장됐다 |
| Preview 변수 | 없음. 7개 모두 Production 전용으로 확인. 알림은 코드에서도 강제로 끔(`VERCEL_ENV=preview`) |
| 배포 보호 | Standard Protection(`all_except_custom_domains`). 배포별 주소는 Vercel 인증이 302로 막는다. 운영 별칭과 Vercel Cron 호출은 통과한다 |
| 마이그레이션 버전 | `001_init` 적용 (2026-10-22, 로컬에서 1회). 재실행 시 "이미 적용됨" 확인 |
| 비인증 401 확인 | 02:56 확인. `/api/cron`·`/api/health` 모두 앱이 401 JSON으로 응답. 잘못된 Bearer도 401. 알림을 켠 재배포 뒤 다시 확인 |
| bootstrap 결과 | 02:59 `success`, 약 52초. 기준 항목 75건(wevity-it 57, dacon 15, oss-notice 3). 3개 소스 모두 `initialized_at` 기록, 알림 0건 |
| 인증된 cron 수동 실행 | 03:00 `api:call` → 200 `success`, 4.6초. 기존 40, 키워드 제외 25, 신규 0, 발송 `disabled`. 신규가 없어 운영에서 알림 행 생성 경로는 아직 실행되지 않았다 |
| Vercel이 호출한 cron | 03:03 `vercel crons run /api/cron` → `job_runs`에 `cron success`(4.3초), 발송 `empty`. 배포 보호 통과와 `CRON_SECRET` 자동 첨부 확인 |
| 연결 테스트 메시지 | 03:01 `mattermost-main` 1건 전송 성공(HTTP 응답 기준). DB 변경 없음 확인. Discord는 보류 |
| 다음 날 자동 실행 확인 | 미확인. 첫 예약 실행은 2026-10-22 09시대 |

### Discord 보류에 따른 차이

- 알림 행은 설정된 채널에만 만든다. 지금은 `mattermost-main`만 만든다.
- 나중에 `DISCORD_WEBHOOK_URL`을 넣으면 그 뒤에 발견한 공고만 Discord로 간다. 그전 공고는 Discord로 보내지 않는다.
- `MAX_NOTIFICATIONS_PER_RUN=10`은 알림 행 기준이다. 채널이 1개라 지금은 실행당 공고 10건이다.
- Mattermost 채널을 바꿀 때는 Webhook 편집에서 채널만 바꾼다. 주소가 그대로라 환경 변수는 건드리지 않는다. Webhook을 새로 만들면 주소가 바뀌므로 `.env.production.local`과 Vercel 값을 바꾸고 재배포한다.
- 지금은 temp 채널에서 확인 중이다. 실제 채널로 옮길 때는 운영 DB 데이터를 초기화하고 bootstrap을 다시 한다(계획서 16장, 2026-10-22 결정).

## 로컬에서 확인한 것 (2026-10-22)

- `vercel@65.0.0 build`를 로컬에서 실행했다. `.vercel/project.json`은 임시로 만들었고, 계정 연결은 없었다. 결과:
  - `api/cron.func`: `runtime: nodejs24.x`, `maxDuration: 240`
  - `api/health.func`: `maxDuration: 30`
  - `crons`: `/api/cron` `0 0 * * *` 1개
  - 정적 산출물: `public/robots.txt` 하나뿐이다. 소스·문서는 공개 경로로 나가지 않는다(`outputDirectory: public`).
  - 빌드된 `cron.func`를 Node로 직접 불러 비인증 요청을 보냈고 401을 받았다.
- 실제 Vercel 프로젝트에서도 같은 값을 다시 확인했다(위 기록 표).

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
   - CLI로는 `vercel link --yes --project jakdang`이 프로젝트 생성과 Git 연결을 한 번에 한다.
     - 부작용: `.env.local`(`VERCEL_OIDC_TOKEN`)을 만들고 `.gitignore`에 `.vercel` 줄을 더한다. 앱은 `.env.local`을 읽지 않으므로 지워도 된다. `.gitignore`는 이미 `.vercel/`이 있어 되돌린다.
   - CLI 배포(`vercel deploy`)는 로컬 폴더를 올리므로 쓰지 않는다. 배포는 Git push로 일으킨다.
5. **환경 변수**
   - Production에 아래 값을 등록한다.
     - `DATABASE_URL`(Neon 운영 pooled)
     - `CRON_SECRET`(`openssl rand -hex 32`)
     - `DISCORD_WEBHOOK_URL`, `MATTERMOST_WEBHOOK_URL`
     - `NOTIFICATIONS_ENABLED=false`
   - Preview에는 운영 DB·Webhook을 넣지 않는다.
   - 값은 표준입력으로 넘긴다: `printf '%s' "$값" | vercel env add <이름> production --sensitive`. `$값`은 `.env.production.local`에서 읽은 셸 변수다.
   - 값을 바꾸면 재배포해야 반영된다: `vercel redeploy <운영 배포 주소> --target production`
6. **프로덕션 배포 후 비인증 확인**
   - 운영 별칭(`https://jakdang-flax.vercel.app`)으로 확인한다. 배포별 주소는 Vercel 인증이 302로 막아 앱까지 가지 않는다.
   - `curl -s -o /dev/null -w '%{http_code}' https://<운영 별칭>/api/cron` → 401
   - `curl -s -o /dev/null -w '%{http_code}' https://<운영 별칭>/api/health` → 401
   - 본문이 `{"ok":false,"error":"인증이 필요합니다"}`인지 본다. Vercel 인증 화면이면 앱이 응답한 것이 아니다.
7. **bootstrap**
   - Webhook을 먼저 등록한다. Webhook이 비어 있으면 bootstrap 뒤 Cron이 새 공고를 알림 행 없이 저장하고, 그 공고는 나중에도 알리지 않는다.
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
    - 예약을 기다리기 전에 `vercel crons run /api/cron`으로 플랫폼 호출을 한 번 확인할 수 있다. `job_runs`에 `cron` 행이 생기면 배포 보호와 `CRON_SECRET` 첨부가 정상이다.
    - 다음 날 `health`의 `lastRun`과 Vercel 대시보드 Cron 실행 기록을 확인한다.
    - 실패하면 플랫폼 로그도 본다.
11. **이 문서의 "기록" 표를 채운다.**

## 주의

- 유료 플랜 구매, 기존 프로젝트 삭제, 운영 DB 초기화는 별도 승인 없이 하지 않는다.
- 통합 테스트를 운영 DB에 돌리지 않는다. `TEST_DATABASE_URL`의 DB 이름에 `test`가 없으면 테스트가 초기화를 거부한다.
- 재배포는 DB를 건드리지 않는다. `source_state`·`source_items`·`notifications`는 Neon에 남는다.
