국내 개발자 행사 알림 봇 — 로컬 구현 및 서버리스 배포 계획서

작성 기준: 2026-10-21 / 개인용 MVP / Claude Code·Codex 인계용

**1. 이번 구현에서 결정한 사항**

목표는 국내 개발자 컨퍼런스·해커톤·대회·공모전·밋업·세미나 공지 목록을 하루 한 번 수집하고, 새 공고의 제목과 링크를 Discord와 Mattermost에 알리는 작은 프로그램이다. 행사 날짜·장소 등 상세 정보는 추출하지 않으며 변경 알림은 보내지 않는다.

배포 대상은 Vercel 하나다. 로컬에서 개발·테스트하고 Git 저장소를 연결해 배포한다. 배포 후 개인 컴퓨터는 켜 두지 않아도 된다.

| 항목          | 결정                                                                           |
| ------------- | ------------------------------------------------------------------------------ |
| 언어          | TypeScript, strict 모드, ESM                                                   |
| 런타임        | Node.js 24 LTS. 로컬은 nvm으로 24 사용, .nvmrc·engines·Vercel 설정을 24.x로 통일 |
| 패키지 관리   | npm, package-lock.json 커밋                                                    |
| 웹 프레임워크 | 사용하지 않음. Vercel Node 함수와 CLI만 구현                                   |
| 영속 저장     | Neon Postgres. 로컬 개발도 별도 개발 DB/브랜치 사용                            |
| DB 접근       | pg + SQL 마이그레이션. 구현 시 드라이버·연결 풀 설정 검증                      |
| 수집          | fetch + rss-parser + cheerio. 목록 페이지만 수집                               |
| 검증          | Zod (환경 변수·소스 설정·목록 항목)                                            |
| 테스트        | Vitest + 실제 개발용 Postgres 통합 테스트                                      |
| 예약          | 플랫폼 Cron. node-cron과 상시 프로세스 사용하지 않음                           |
| 알림 내용     | 제목 + 링크. 날짜·장소 추출과 LLM은 사용하지 않음                              |
| 알림          | Discord/Mattermost 둘 다 구현하고 운영에서도 둘 다 설정                        |
| 초기 규모     | 검증된 소스 3개, 최대 5개                                                      |
| 기본 주기     | 매일 한국 시간 오전 9시대. 정확한 분 단위 실행을 약속하지 않음                 |

SQLite 파일은 로컬·운영 간 DB 차이와 서버리스 영속 저장 문제를 피하기 위해 이번 구현에서 제외한다. 별도 서버, Docker 운영, Redis, 메시지 큐 서비스, 관리자 웹 화면, 브라우저 자동화, LLM, 날짜 추출, 변경 알림, Dots/Grok Bot 연동은 초기 범위에서 제외한다.

**2. 공식 문서로 확인한 배포 조건**

- Vercel Hobby Cron은 각 작업에 하루 한 번 주기를 요구하며, 해당 시간대 안에서 실행 시각이 달라질 수 있다. 초기 Cron은 하나만 등록한다. [공식 문서](https://vercel.com/docs/cron-jobs/usage-and-pricing)
- Vercel은 CRON_SECRET을 Authorization: Bearer 헤더로 전달한다. 서버는 이를 검사해야 한다. [공식 문서](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
- Vercel Fluid Compute의 현재 Hobby 함수 최대 실행 시간은 300초다. 이 계획은 함수 240초, 내부 작업 예산 210초를 초기값으로 사용한다. 배포 시 실제 프로젝트 설정에서 재확인한다. [공식 문서](https://vercel.com/docs/functions/configuring-functions/duration)
- 서버리스 함수의 로컬 파일은 영구 DB로 사용하지 않는다. [Vercel 설명](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel)
- Neon은 서버리스 환경의 Postgres 연결 방식을 제공한다. 실제 pg 연결은 Neon pooled connection URL을 사용하고 TLS 설정을 검증한다. HTTP 드라이버를 대신 선택한다면 대화형 트랜잭션 지원 차이를 확인해야 한다. [Neon 연결 문서](https://neon.com/docs/serverless/serverless-driver)

요금·무료 한도는 보장하지 않는다. 구현자는 배포 계정의 현재 한도를 README에 기록하고, 기능 테스트를 위해 임의로 유료 플랜을 구매하지 않는다.

**3. 실행 흐름과 작업 예산**

```text
로컬 CLI / Vercel Cron
  → 동일한 runSync(options) 호출
  → DB 임대 잠금 획득
  → 기존 미발송 알림 일부 재시도
  → 초기화된 소스의 목록 수집
  → 새 항목 판별 (source_id + external_key, 정규화 URL)
  → 트랜잭션으로 항목·알림 저장
  → 남은 시간 내 알림 발송
  → 실행 결과 저장 + 잠금 해제
```

초기 실행 제한은 목록 소스 3~5개, 알림 최대 10건이다. 소스별 목록 탐색 범위는 SOURCES.md에 정한다. 도메인별 동시 요청 1개, 전체 동시 요청 최대 3개로 제한한다.

각 HTTP 요청은 10초 타임아웃을 기본값으로 사용한다. 동일 도메인 요청 사이에 최소 1초 간격을 둔다. 모든 요청은 남은 작업 시간보다 짧은 타임아웃을 사용한다.

210초가 가까워지면 새 작업을 멈추고 실행 결과를 저장한다. 발견한 항목과 알림은 발견 즉시 DB에 저장하므로 미발송 알림은 다음 실행에서 이어 보낸다. 미발송 알림이 계속 쌓이면 실행 결과에 backlog 경고를 기록한다.

리스 갱신은 작업 중 주기적으로 수행하며 플랫폼 응답 후 살아 있는 타이머나 미대기 Promise에 작업을 맡기지 않는다. 응답은 이번 실행의 저장과 발송 처리가 끝난 뒤 반환한다.

**4. 저장소 구조와 명령 계약**

아래는 새 프로젝트의 저장소 상대 경로다.

```text
api/
  cron.ts                  Vercel GET, 인증 후 runSync 호출
  health.ts                인증된 DB·최근 실행 상태 조회
src/
  config.ts                환경 변수 검증
  sources.ts               실제 검증된 소스 설정
  core/run-sync.ts          플랫폼과 무관한 실행 로직
  core/collect.ts           목록 수집·항목 파싱
  core/detect.ts            URL 정규화·신규 판정
  core/deliver.ts           알림 claim·전송·상태 갱신
  collectors/rss.ts
  collectors/html.ts
  collectors/adapters/      사이트별 최소 로직
  notifications/discord.ts
  notifications/mattermost.ts
  db/client.ts
  db/repository.ts
  cli.ts
migrations/
  001_init.sql
scripts/
  migrate.ts
tests/
  fixtures/                합성 또는 필요한 범위의 축약 HTML/RSS
  unit/
  integration/
docs/
  SOURCES.md
  DEPLOY.md
  OPERATIONS.md
.env.example
.gitignore
.nvmrc
package.json
tsconfig.json
vercel.json
README.md
```

Next.js나 대시보드를 추가하지 않는다.

구현할 명령:

```text
npm ci
npm run typecheck
npm run test
npm run test:integration
npm run build
npm run db:migrate
npm run sources:check
npm run sync -- --dry-run
npm run sync -- --bootstrap [--source <id>]
npm run sync
npm run notifications:flush
npm run notifications:resolve -- --id <id> --action retry|sent
npm run notifications:test -- --destination <id>
```

--dry-run은 수집과 예상 알림을 출력하되 DB와 발송 상태를 변경하지 않고 Webhook을 호출하지 않는다. 잠금·실행 기록도 쓰지 않는다. DB는 비교 목적으로 읽을 수 있다.

--bootstrap은 소스별 기준 데이터를 저장하고 알림을 만들지 않는다. 로컬에서 수동 실행하며, 작업 시간 한도를 적용하지 않고 SOURCES.md의 최대 탐색 범위까지 목록을 모두 읽는다. 도메인별 요청 간격·요청 타임아웃은 유지한다. 이때 발견한 항목은 is_baseline으로 표시한다. 처리를 마친 소스에만 initialized_at을 기록한다. Cron 실행은 initialized_at이 없는 소스를 건너뛰고 실행 결과에 기록한다. 첫 실행에서 실패한 소스와 나중에 추가한 소스는 --source로 지정해 --bootstrap을 다시 실행한다.

notifications:test는 합성 테스트 메시지 1건을 지정 채널에 보내고 결과를 화면과 로그에만 출력한다. DB에는 기록하지 않는다. 명시적으로 실행할 때만 보낸다.

명령의 부작용과 사용 예시는 README에 명시한다.

**5. 초기 수집처 선정 작업**

구현자는 수집기 작성 전에 공개 소스 후보를 조사해 실제로 동작하는 소스 3개를 선정한다. 대상 행사는 컨퍼런스, 해커톤, 대회·공모전, 밋업·세미나다. 개발자 행사 모음 목록을 우선 조사하고, 모음 목록만으로 3개를 채우지 못하면 다른 유형을 추가한다. 선정 결과가 네 유형을 어떻게 다루는지 SOURCES.md에 기록한다. RSS는 실제 피드를 발견했을 때만 운영 소스로 등록한다. RSS 파서는 합성 fixture로도 검증한다.

조사 후보는 공식 행사·기관 공지, 공개 개발자 행사 모음, Dacon 등의 대회 목록, Festa/이벤터스 등의 행사 플랫폼이다. 이 이름들은 조사 후보이며 현재 RSS·API·자동 수집 지원이 확인된 목록이 아니다. 로그인·브라우저 실행이 필요한 후보는 대체 소스로 바꾼다.

docs/SOURCES.md에 반드시 기록할 내용:

- 실제 목록 URL, 항목 링크 예시, 공식/플랫폼/커뮤니티 구분
- 확인 날짜, 수집 방식, 선택자 또는 실제 RSS URL
- robots.txt·이용 조건 확인 내용, 요청 간격
- 페이지네이션/최대 탐색 범위, 사이트 항목 ID 추출 방식
- 어떤 행사 유형을 제공하는지, 개발 행사가 아닌 항목이 섞이는지, 수집 누락 가능 범위
- 키워드 필터 사용 여부와 키워드 목록
- 직접 확인한 항목(제목·링크·ID) 예시와 테스트 fixture

가짜 URL·추측한 RSS 주소·샘플 선택자를 운영 설정에 넣지 않는다. 자료가 막히면 다른 공개 소스를 찾아 계속 진행한다. 전체 국내 행사를 포괄한다고 표현하지 않는다.

소스 설정에는 id, kind, listUrl, allowedHosts, authority, selectors, keywords, parserVersion, enabled를 둔다. 임의 URL을 받는 공개 API는 만들지 않는다. 상세 페이지와 접수 링크는 fetch하지 않는다.

개발 행사가 아닌 항목이 섞인 소스는 keywords(제목 키워드 목록)를 둔다. 제목에 키워드가 하나라도 있을 때만 알린다. keywords가 없는 소스는 모든 항목을 알린다. 키워드에 걸리지 않은 항목은 저장하지 않고 매 실행마다 다시 검사한다. 키워드를 늘리면 목록에 남아 있던 해당 공고도 다음 실행에서 알린다.

목록이 갑자기 비거나 필수 선택자가 없어지면 parser_error로 기록한다. 수집 실패·404·목록에서 사라짐만으로 항목을 삭제하지 않는다.

**6. 최소 DB 모델**

다음 5개 테이블로 시작한다. 마이그레이션 실행 기록 테이블은 별도로 둔다. 모든 ID는 UUID, 시각은 timestamptz로 저장한다.

| 테이블        | 필수 필드·제약                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| source_state  | source_id PK, initialized_at, etag, last_modified, last_success_at, last_error                                                                                                                   |
| source_items  | id, source_id, external_key, url, normalized_url, title, first_seen_at, last_seen_at, is_baseline; UNIQUE(source_id, external_key)                                                               |
| notifications | id, source_item_id NOT NULL, destination_id, kind, dedupe_key, payload jsonb, status, attempts, next_attempt_at, claimed_until, claim_token, remote_message_id, last_error, created_at; UNIQUE(destination_id, dedupe_key) |
| job_runs      | id, started_at, finished_at, status, counts jsonb, error_summary                                                                                                                                  |
| job_locks     | name PK, owner, expires_at                                                                                                                                                                       |

source_items는 목록의 한 항목을 한 행으로 저장한다. 한 공고에 여러 행사가 섞여 있어도 공고 하나로 알린다.

job_locks는 INSERT ... ON CONFLICT ... WHERE expires_at < now() RETURNING 방식으로 원자적으로 획득한다. 실행별 UUID owner를 사용하고 소유자 일치 시에만 갱신·해제한다. 잠금 상실 시 새 DB 변경·발송을 중단한다. 임대 시간은 정상 실행 예산보다 길게 설정하고 갱신한다.

항목 INSERT와 알림 INSERT는 같은 짧은 트랜잭션에서 처리한다. pg의 동일 client로 BEGIN/COMMIT하고 finally에서 연결을 반환한다. 네트워크 호출은 트랜잭션 밖에서 한다. 동시 flush는 알림 claim_token과 claimed_until로 보호한다.

**7. 항목 식별과 신규 판정**

1. 목록에서 제목·링크·사이트 항목 ID를 읽는다. 제목은 공백을 정리하고 최대 200자로 자른다.
2. Zod로 제목이 비어 있지 않은지, 링크가 허용 호스트의 HTTP(S) URL인지 검증한다. 실패한 항목은 건너뛰고 실행 결과에 개수를 기록한다.
3. external_key는 사이트 항목 ID를 우선 사용하고, 없으면 정규화 URL을 쓴다.
4. 동일 source_id/external_key는 이미 아는 항목이다. last_seen_at만 갱신하고 알림을 만들지 않는다.
5. 다른 소스라도 normalized_url이 같으면 알림을 만들지 않는다. 제목만으로 같은 공고라고 판정하지 않는다.
6. URL에서는 utm\_\* 등 확인된 추적 인자만 제거하며 항목 식별 인자는 유지한다.
7. 소스에 keywords가 있으면 2번 검증 뒤에 제목을 검사한다. 키워드가 하나라도 포함될 때만 항목을 저장하고 신규 알림을 만든다. 걸리지 않은 항목은 저장하지 않는다. 대소문자는 구분하지 않는다.

**8. 알림 처리**

알림은 코드 템플릿으로 생성한다. MVP는 신규 공고 알림 1종만 넣는다. 변경 알림·마감 리마인더·일일 요약은 넣지 않는다.

```text
[신규] 공고 제목
출처: 소스 이름
링크: URL
확인 시각: 한국 시간
참조: 항목 ID 짧은 값
```

destination_id는 discord-main, mattermost-main처럼 안정적인 별칭을 쓴다. Webhook URL이나 그 해시는 키에 쓰지 않아 URL 교체 때 재발송되지 않게 한다. 채널을 새로 연결해도 과거 항목 전체를 자동 전송하지 않는다.

dedupe_key는 `<source_item_id>:new`다. 알림 생성 시 payload를 고정 저장하고, 재시도할 때 내용을 바꾸지 않는다.

- Discord: wait=true, allowed_mentions.parse=[], UTF-16 길이 기준 content 최대 2,000 이하. 한 공고당 메시지 1개. 성공 응답의 message ID 저장. [공식 문서](https://docs.discord.com/developers/resources/webhook)
- Mattermost: text payload, 성공 응답 확인. 제목에서 온 @channel/@here/@사용자 멘션과 원치 않는 Markdown 링크를 안전하게 표시한다. [공식 문서](https://docs.mattermost.com/developers/integrate/webhooks/incoming)
- 429: Retry-After/retry_after를 읽어 next_attempt_at 저장. 긴 sleep을 하지 않는다.
- 5xx: 제한된 횟수의 재시도. 기본 다음 시도는 1분·5분·30분 이후로 예약하되 실제 처리 시점은 다음 작업 실행이다.
- 400/401/403/404: failed 상태와 조치 사유 기록. 키·payload 수정 후 수동 재시도 가능.
- 응답 유실·송신 직후 프로세스 종료: 전달 여부가 불명확한 항목은 uncertain으로 둔다. 자동 중복 재전송 대신 notifications:resolve로 확인 후 재시도 또는 전송 완료 처리한다.

status는 pending, sending, sent, failed, uncertain을 지원한다. sending claim이 만료된 항목은 uncertain으로 복구한다. 정확히 한 번 전송을 보장한다고 문서화하지 않는다.

중요: 하루 한 번 Cron이면 재시도 시각이 1분 뒤여도 자동 처리는 다음 날이 될 수 있다. 같은 실행 내 짧은 재시도는 남은 예산 내 1회만 허용하고, 빠른 복구는 로컬 flush 명령으로 수행한다. 분 단위 자동 재시도가 필요해질 때 실행 주기를 늘린다. 초기 단계에서 별도 큐를 추가하지 않는다.

**9. 환경 변수와 보안 동작**

```dotenv
DATABASE_URL=
CRON_SECRET=
NOTIFICATIONS_ENABLED=false
DISCORD_WEBHOOK_URL=
MATTERMOST_WEBHOOK_URL=
MAX_NOTIFICATIONS_PER_RUN=10
RUN_BUDGET_MS=210000
LOG_LEVEL=info
```

NOTIFICATIONS_ENABLED는 true/false 문자열을 명시적으로 파싱한다. Boolean('false')처럼 false 문자열을 참으로 처리하는 변환을 사용하지 않는다. 설명·사용자용 로그·README는 한국어로 작성한다.

- 비밀 없는 .env.example만 커밋하고 .env\*, .vercel, 임시 결과물을 ignore한다. .env.example은 예외로 추적한다.
- 운영과 개발 DB를 구분한다. preview 배포에는 운영 DB·운영 Webhook을 넣지 않고 알림을 비활성화한다.
- CRON_SECRET은 충분히 긴 난수로 로컬에서 만들고 로그·URL 쿼리에 출력하지 않는다.
- api/cron과 api/health는 비밀 누락/잘못된 Authorization에 401을 반환한다. 실제 비밀이 없는데 undefined 비교로 허용하지 않는다.
- cron은 GET만 허용하고 Cache-Control: no-store를 설정한다. health는 URL·토큰을 노출하지 않는다.
- NOTIFICATIONS_ENABLED=false일 때 발송하지 않고 sent로 표시하지 않는다. 새 알림은 pending에 남는다. 다시 켜면 쌓인 알림을 생성 순서대로, 실행당 MAX_NOTIFICATIONS_PER_RUN 안에서 보낸다.
- 소스별 허용 호스트·리디렉션·응답 크기 2MB 한도·HTTP(S)·사설/메타데이터 주소 차단을 공통 fetch에 둔다. 리디렉션은 자동 추적하지 않고 각 목적지를 검사한다. DNS가 사설 주소를 가리키는 경우도 연결 시점에 차단한다.
- 원문 전체를 운영 로그에 기본 출력하지 않는다. Webhook URL은 경로 자체가 비밀이므로 통째로 마스킹한다.

**10. 로컬 개발 순서**

| 단계 | 작업                                      | 완료 기준                                          |
| ---- | ----------------------------------------- | -------------------------------------------------- |
| A    | npm/TS/테스트/명령 스켈레톤, .env.example | 외부 키 없이 typecheck와 단위 테스트 실행          |
| B    | pg 연결·마이그레이션·저장소·잠금          | 개발 Postgres에서 실제 제약·트랜잭션 테스트 통과   |
| C    | 수집처 조사 및 3개 어댑터                 | SOURCES.md와 검증 fixture 존재, sources:check 성공 |
| D    | 항목 파싱·URL 정규화·신규 판정            | 동일 입력 재처리 시 새 알림 없음                   |
| E    | 알림 상태·두 Webhook 어댑터               | 모의 HTTP에서 성공/실패/불확실 상태 검증           |
| F    | CLI와 Vercel 어댑터·인증                  | 같은 runSync 사용, 비인증 호출 차단                |
| G    | 로컬 관찰·배포·스모크 테스트              | 실제 예약 실행을 다음 날 확인                      |

개발 DB가 필요한 시점에 사용자에게 연결 URL을 요청하되, 그 전까지 fixture 기반 구현과 단위 테스트를 계속한다. 계정 정보 없이 외부 계정을 생성했다고 주장하지 않는다.

실제 개발용 Postgres가 있으면 그것을 사용한다. 없다면 사용자가 원할 때 Docker의 Postgres를 테스트용으로 사용할 수 있으나 Docker 설치를 기본 전제로 하지 않는다. 로컬 SQLite로 Postgres 통합 테스트를 대체하지 않는다.

**11. 필수 테스트와 품질 기준**

구현을 그대로 복제하는 테스트 대신 다음 실패 상황을 검증한다.

1. 같은 목록을 재처리해도 신규 알림은 항목당 1개다.
2. 다른 소스의 항목이라도 정규화 URL이 같으면 알림을 만들지 않는다.
3. URL 정규화는 확인된 추적 인자만 제거하고 식별 인자는 유지한다.
4. 제목이 비었거나 허용 호스트가 아닌 링크는 건너뛰고 개수를 기록한다.
5. 선택자 고장·빈 목록·404가 기존 항목 삭제로 전파되지 않는다.
6. dry-run은 DB 변경과 알림을 만들지 않는다.
7. bootstrap은 알림 없이 항목을 is_baseline으로 저장한다. 초기화되지 않은 소스는 Cron이 건너뛴다.
8. 실제 DB 동시 실행 두 개 중 잠금 획득은 하나만 성공한다. 임대 소유자 일치 검증과 만료 복구가 동작한다.
9. 항목 INSERT 뒤 알림 INSERT가 실패하면 트랜잭션 전체가 롤백된다.
10. 429/5xx/잘못된 Webhook을 구분하고 sent를 잘못 찍지 않는다.
11. 전송 중 종료·응답 유실은 uncertain으로 복구되고 명시적으로 해결 가능하다.
12. 인증 누락과 빈 CRON_SECRET, preview 설정이 운영 알림을 허용하지 않는다.
13. 처리 시간·알림 수 한도 도달 시 미발송 알림이 다음 실행에서 이어진다.
14. 제목 속 멘션·Markdown 링크가 채널에서 동작하지 않는다.
15. NOTIFICATIONS_ENABLED=false 동안 쌓인 알림은 다시 켠 뒤 생성 순서대로 나간다.
16. keywords가 있는 소스에서 키워드가 없는 제목은 저장하지 않고 알림도 만들지 않는다. 키워드를 추가하면 다음 실행에서 해당 공고를 알린다.
17. notifications:test는 메시지를 보내되 DB를 변경하지 않는다.

단위 테스트는 기본 외부 네트워크를 차단한다. DB 통합 테스트는 별도 테스트 DB에서 실행하고 운영 DB로 보이는 URL에는 파괴적 초기화를 거부한다. 테스트에서 운영 Webhook을 호출하지 않는다.

**12. Vercel 배포 절차**

설정 초안:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "api/cron.ts": { "maxDuration": 240 }
  },
  "crons": [{ "path": "/api/cron", "schedule": "0 0 * * *" }]
}
```

Cron은 UTC 기준으로 설정한다. 0 0 \* \* \*는 한국 시간 오전 9시대 실행을 의도한다. Hobby에서는 정확히 09:00에 실행된다고 안내하지 않는다. 함수·런타임 인식과 maxDuration 적용은 실제 빌드 로그에서 확인한다.

배포 순서:

1. 로컬에서 typecheck, 단위 테스트, 통합 테스트, build를 통과시킨다. npm run build는 타입 검사와 컴파일을 수행하고 플랫폼 빌드 검증도 별도로 한다.
2. 비공개 Git 저장소를 준비하고 비밀 파일이 제외됐는지 확인한다.
3. Neon 운영 DB를 만들고 운영 대상에 001_init.sql 마이그레이션을 1회 적용한다. 빌드나 매 요청마다 migration하지 않는다. 재실행 안전한 migration 기록을 둔다.
4. Vercel 프로젝트를 저장소에 연결한다. 프레임워크는 Other, Node 버전은 로컬과 맞춘다. 화면용 정적 산출물을 요구하지 않도록 함수 프로젝트 설정을 검증한다.
5. Production 환경 변수에 DB·CRON_SECRET·Webhook을 등록한다. NOTIFICATIONS_ENABLED=false로 시작한다. Preview는 운영 비밀을 공유하지 않는다.
6. 프로덕션 배포 후 비인증 cron/health가 401인지 확인한다.
7. 운영 DB에 로컬 --bootstrap을 한 번 실행한다. 그동안 Cron은 비활성화하거나 잠금으로 겹침을 막고, 기준 데이터 초기화 결과를 확인한다.
8. 인증된 cron 수동 실행으로 수집·저장·run 기록을 확인한다. 아직 발송은 비활성화한다.
9. NOTIFICATIONS_ENABLED=true로 변경하고 재배포한다. 실제 알림 연결 확인은 로컬에서 notifications:test로 합성 테스트 메시지를 Discord·Mattermost 채널에 1건씩 보내고, 결과는 화면·로그로 확인한다. DB에는 기록하지 않는다.
10. Cron을 활성화하고 다음 날 job_runs와 플랫폼 실행 기록에서 자동 실행을 확인한다. 플랫폼 실패는 플랫폼 로그에서도 확인한다.
11. DEPLOY.md에 배포 URL, Node 버전, 적용한 일정·시간 제한, 비밀 변수 이름, migration 버전, 검증 결과를 남긴다. 비밀 값은 쓰지 않는다.

수동 API 호출 스크립트는 환경 변수에서 비밀을 읽고 Authorization 헤더로 보낸다. 비밀을 명령 인자·주소창·로그에 넣지 않는다. 재배포로 source_state나 DB가 초기화되지 않아야 한다.

**13. 운영·복구·다음 버전**

운영 상태는 job_runs의 마지막 성공/부분 성공, 소스별 오류, pending/uncertain 알림, backlog 개수로 확인한다. 모든 소스 실패는 failed, 일부 실패는 partial로 기록하며 API 응답의 성공 여부도 이를 반영한다. 예외·프로세스 종료로 finished_at이 비어 있는 실행은 stale로 보여 준다.

문제 발생 시:

- 알림 중단: NOTIFICATIONS_ENABLED=false로 변경 후 재배포한다.
- 전체 실행 중단: 플랫폼 Cron도 비활성화한다. 기능 플래그는 수집 중단과 구분한다.
- 소스 고장: 해당 소스만 비활성화하고 fixture를 갱신한다.
- 전송 실패: 설정 복구 후 notifications:flush를 실행한다.
- 전송 여부 불명확: 채널에서 참조 ID를 확인하고 notifications:resolve로 처리한다.
- 잘못된 중복 판정: URL 정규화 규칙과 source_items를 확인해 수정한다.
- DB 복구: 항목과 발송 이력을 함께 복구한다. 발송 이력을 잃은 상태에서 자동 재발송을 시작하지 않는다.

source_items는 제목·링크만 저장하며 원문은 저장하지 않는다. 발송 이력은 남긴다. 데이터 규모가 커지면 별도 보존 정책을 추가한다.

다음 버전 후보는 시간당 수집, 관심 필터, D-7/D-1 리마인더, 실패 자동 복구 주기 단축이다. Dots/Grok Bot의 실제 HTTP 호출·예약·상태 보존·인증 지원은 확인되지 않았으며, MVP의 의존성으로 넣지 않는다.

**14. 로컬 코딩 에이전트에게 넘길 작업 지시**

아래 내용을 이 계획서와 함께 전달한다.

> 이 문서를 실행 명세로 삼아 국내 개발자 행사 알림 봇을 현재 로컬 저장소에 구현해 주세요. 먼저 기존 파일과 AGENTS.md를 확인하고 기존 작업을 보존하세요. 기본은 Vercel Node.js 함수 + TypeScript + Neon Postgres이며, Next.js·관리자 화면·상시 서버를 추가하지 마세요.
>
> 설정·DB·fixture 테스트부터 시작하고, 실제 공개 수집처 3개를 조사·검증한 뒤 SOURCES.md에 근거를 남겨 주세요. RSS/API/선택자를 추정해 운영 설정에 넣지 마세요. 알림은 제목과 링크만 보내며 날짜 추출·LLM·변경 알림은 구현하지 마세요. 목록 수집, 신규 판정, 소스별 bootstrap, dry-run, 인증, 발송 상태와 실제 DB 테스트를 구현하세요.
>
> 계정·비밀이 없는 동안 가능한 코드·문서·단위 테스트를 완료하세요. 필요한 시점에만 DATABASE_URL과 사용할 Webhook·호스팅 계정 연결을 요청하고 비밀을 채팅이나 로그에 출력하지 마세요. 기본 결정은 이 문서를 따르고 일반적인 구현 선택마다 확인을 요청하지 마세요.
>
> 로컬 검증을 마친 뒤 사용자가 제공한 계정과 권한 범위에서 Vercel에 배포해 주세요. 이 작업 지시는 지정된 Discord·Mattermost 채널에 연결 테스트 메시지를 1건씩 보내는 것을 포함합니다. 유료 플랜 구매·기존 프로젝트 삭제·운영 DB 초기화는 별도 승인 없이 하지 마세요.
>
> 완료 시 실제 구현 파일, 테스트 결과, 배포 URL, 마이그레이션 상태, Cron 일정, 환경 변수 이름, 확인된 수집처, 남은 제약을 보고하세요. 실제 배포하지 않았으면 배포 완료라고 쓰지 말고, 아직 자연 발생하지 않은 신규 감지는 fixture로 검증한 것과 실제 운영 검증을 구분하세요. 다음 날 예약 실행 확인이 남아 있으면 명확히 표시하세요.

**15. 최종 완료 체크리스트**

- [ ] npm ci 이후 명시된 명령으로 로컬 재현 가능
- [ ] 실제 수집처 3개와 접근·파싱 검증 기록 존재
- [ ] 운영 DB 영속 저장과 재배포 후 상태 유지 확인
- [ ] 같은 입력 중복 알림 없음
- [ ] 잘못된 인증 차단, preview 운영 발송 차단
- [ ] DB 동시 실행·rollback·불확실 전송 복구 검증
- [ ] Vercel에 배포, 불필요한 다른 Cron 없음
- [ ] 지정 채널 연결 테스트 결과를 로그로 확인
- [ ] 플랫폼 예약 실행 설정 확인
- [ ] 다음 날 실제 자동 실행 확인 또는 미확인 상태 명시
- [ ] README·SOURCES·DEPLOY·OPERATIONS에 인계 정보 기록

**16. 결정 기록**

현재 결정 (2026-10-21):

- 알림 내용: 모든 알림은 '제목 + 링크'만 보낸다. 날짜·장소 추출, LLM, 변경 알림은 하지 않는다.
- 같은 공고 판정: source_id + external_key, 그리고 정규화 URL로만 판단한다.
- review 단계를 두지 않는다.
- bootstrap: 로컬에서 수동으로 실행하고, 시간 한도 없이 최대 탐색 범위까지 읽는다. Cron은 초기화되지 않은 소스를 건너뛴다. 소스를 추가하거나 첫 실행이 실패하면 소스를 지정해 다시 실행한다.
- bootstrap 중 발견한 항목은 기준 데이터(is_baseline)로 보고 알림을 만들지 않는다.
- 알림을 꺼 둔 동안 쌓인 알림은 다시 켰을 때 생성 순서대로 보낸다.
- 연결 테스트 메시지: DB에 남기지 않고 화면·로그로만 확인한다.
- 개발 행사가 아닌 항목이 섞인 소스: 소스별 제목 키워드 필터를 쓴다.
- 키워드에 걸리지 않은 항목: 저장하지 않고 매 실행 다시 검사한다.
- Node 버전: 24 LTS. 로컬은 nvm으로 맞춘다.
- 대상 행사 (2026-10-22): 컨퍼런스, 해커톤, 대회·공모전, 밋업·세미나.
- 수집처 유형: 개발자 행사 모음 목록을 우선한다.
- 알림 채널: Discord와 Mattermost 둘 다 운영한다.
  - (2026-10-22) 첫 운영은 Mattermost만 한다. Discord는 보류한다.
- 배포 플랫폼: Vercel 하나만 쓴다. Netlify 대안은 계획서에서 삭제했다. 하루 여러 번 실행이 필요해지면 다시 검토한다.
- Mattermost 채널 이동 (2026-10-22): temp 채널에서 확인한 뒤 실제 채널로 옮길 때 운영 DB 데이터를 초기화하고 bootstrap을 다시 한다. temp 기간의 발송 이력은 버린다. 새 채널은 그 뒤에 발견한 공고만 받는다.

'링크만' 결정으로 효력을 잃은 결정 (기록용):

- 미발송 신규 알림 뒤 변경이 생기면 신규와 변경을 2건으로 보낸다.
- 미발송 변경이 여러 개면 1건으로 합친다.
- 애매한 새 값은 저장 값을 새 값으로 갱신하고 '확인 필요'로 알린다.
- 애매한 경우는 '확인 필요' 표시로 일단 알린다.
- 꺼 둔 동안 쌓인 알림은 참가 신청 마감 기준으로 생략하고, 신청 마감을 모르면 보낸다.
- 발견 시점에 이미 마감된 행사는 보내지 않는다. 이 결정은 '링크만'과 충돌해서 '링크만'을 우선했다.

결정 대기: 없음.
