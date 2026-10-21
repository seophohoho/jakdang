# 운영 안내

## 상태 확인

1. **health API**: `npm run api:call -- --path health --env-path .env.production.local`
   - `lastRun.status`
     - `success`: 모든 소스 정상
     - `partial`: 일부 소스 실패 또는 시간 부족
     - `failed`: 모든 소스 실패 또는 예외
     - `skipped`: 다른 실행이 잠금 보유
     - `stale`: 시작 후 10분이 지나도 끝나지 않음. 예외나 프로세스 종료로 `finished_at`이 비어 있는 상태
   - `lastSuccessAt`: 마지막 success·partial 실행의 시작 시각
   - `sources[]`: `initialized`, `lastSuccessAt`, `lastError`. URL은 호스트만 표시된다.
   - `notifications`: 상태별 개수. `duePending`은 지금 보낼 수 있는 pending이다.
   - `backlogWarning`: pending이 `MAX_NOTIFICATIONS_PER_RUN`보다 많으면 true
2. **DB에서 직접 보기** (운영 DB 읽기만)
   ```sql
   SELECT started_at, finished_at, mode, status, error_summary,
          counts->'totals' AS totals, counts->'delivery' AS delivery, counts->'backlog' AS backlog
     FROM job_runs ORDER BY started_at DESC LIMIT 10;
   SELECT source_id, initialized_at, last_success_at, last_error, last_error_at FROM source_state;
   SELECT status, count(*) FROM notifications GROUP BY status;
   ```
3. **Vercel 대시보드**: Cron 실행 기록과 함수 로그. 로그는 JSON 한 줄씩이고 비밀은 마스킹된다.

## 실행 순서와 한도

cron 한 번은 다음 순서로 진행된다(최대 210초).

1. `sync` 임대 잠금을 획득한다. 임대는 300초이고 30초마다 체크포인트에서 갱신한다.
2. claim이 만료된 `sending` 알림을 `uncertain`으로 바꾼다.
3. 기존 pending 알림을 한도의 절반까지 먼저 보낸다.
4. 초기화된 소스만 수집한다. 동시 3개이고 같은 호스트에는 1초 간격을 둔다.
5. 항목과 알림을 저장한다. 항목 하나마다 짧은 트랜잭션으로 처리한다.
6. 남은 한도만큼 보낸다. 생성 순서대로이고, 남은 시간이 3초 미만이면 멈춘다.
7. 실행 결과를 저장하고 잠금을 해제한다.

알림 상태:

| 상태 | 뜻 | 다음 처리 |
| --- | --- | --- |
| `pending` | 보낼 차례를 기다림 | 다음 실행 또는 `notifications:flush` |
| `sending` | 보내는 중(claim 보유) | 60초 안에 끝나지 않으면 다음 실행 시작 때 `uncertain` |
| `sent` | 전송 확인(또는 수동 완료 처리) | 없음 |
| `failed` | 4xx 거절 또는 재시도 한도 초과 | 원인 수정 후 `resolve --action retry` |
| `uncertain` | 응답 유실·시간 초과로 전달 여부 모름 | 채널 확인 후 `resolve --action sent` 또는 `retry` |

재시도 규칙:

- 429: Retry-After만큼 미룬다. 5초 이하면 같은 실행에서 한 번 더 시도한다.
- 5xx와 연결 전 실패: 1분 → 5분 → 30분 순서로 예약한다. 4번째 실패면 `failed`가 된다.
- 하루 1회 cron이라 예약 시각이 지나도 실제 재시도는 다음 실행 때 일어난다.

## 문제별 조치

- **알림 중단**
  - Production `NOTIFICATIONS_ENABLED=false`로 바꾸고 재배포한다.
  - 수집은 계속되고 새 알림은 `pending`으로 쌓인다.
  - 다시 켜면 생성 순서대로 실행당 한도 안에서 나간다.
- **전체 실행 중단**
  - Vercel 프로젝트 설정에서 Cron을 끈다(기능 플래그와 별개).
- **소스 고장**(`parser_error`, `http_error` 반복)
  1. `npm run sources:check -- --source <id>`로 원인을 본다.
  2. 고치기 전까지 `src/sources.ts`에서 그 소스만 `enabled: false`로 두고 배포한다.
  3. 선택자를 고칠 때는 fixture를 갱신하고 `parserVersion`을 올린다.
  - 수집 실패·404·목록에서 사라진 항목은 삭제하지 않는다.
- **소스 추가 또는 첫 bootstrap 실패**
  - `npm run sync -- --bootstrap --source <id> --env-path .env.production.local`
  - 기준 데이터만 저장하고 알림은 만들지 않는다.
- **키워드 변경**
  - `src/sources.ts`의 `keywords`를 고치고 배포한다.
  - 설정 지문이 바뀌어 다음 실행은 조건부 요청 없이 목록을 다시 읽는다.
  - 새 키워드에 걸린 공고가 목록에 남아 있으면 알린다.
- **전송 실패**(`failed`)
  1. health나 `notifications:flush` 출력에서 사유를 본다.
     - 401·403: 토큰
     - 404: Webhook 삭제
     - 400: payload
  2. Webhook 설정을 고친다.
  3. `npm run notifications:resolve -- --id <알림 ID> --action retry --env-path .env.production.local`
  4. `npm run notifications:flush -- --env-path .env.production.local`로 바로 보낸다.
- **전송 여부 불명확**(`uncertain`)
  1. `notifications:flush` 출력의 "확인이 필요한 알림"에서 알림 ID와 `참조` 값을 본다.
  2. 채널 메시지 마지막 줄의 `참조: xxxxxxxx`와 대조한다.
  3. 채널에 있으면 `--action sent`, 없으면 `--action retry`로 처리한다.
  - 자동으로 다시 보내지 않는다.
- **잘못된 중복 판정**
  - `source_items`의 `external_key`·`normalized_url`을 확인한다.
  - URL 정규화는 `utm_*`, `fbclid`, `gclid`, `dclid`, `msclkid`, `igshid`, `mc_cid`, `mc_eid`, `_hsenc`, `_hsmi`만 지운다(`src/core/detect.ts`).
  - 사이트 ID 추출 규칙은 `src/collectors/adapters/`에 있다.
- **backlog 경고**
  - 신규가 실행당 한도보다 많은 날이 이어지는 상태다.
  - `MAX_NOTIFICATIONS_PER_RUN`을 올리거나(최대 100) 로컬에서 `notifications:flush`를 실행한다.
- **stale 실행**
  - 함수가 시간 제한이나 예외로 끝났을 가능성이 높다. Vercel 함수 로그를 확인한다.
  - 잠금은 임대 만료(최대 5분) 뒤 다음 실행이 회수한다.
- **DB 복구**
  - `source_items`와 `notifications`를 함께 복구한다.
  - 발송 이력을 잃은 상태에서 cron을 켜면 과거 공고가 다시 신규로 잡힌다. 이때는 cron을 끄고 `--bootstrap`으로 기준 데이터를 다시 만든 뒤 켠다.

## 데이터 보존

- `source_items`는 제목·링크·ID·처음/마지막 확인 시각만 저장한다. 원문은 저장하지 않는다.
- 발송 이력(`notifications`)은 지우지 않는다. 데이터가 커지면 별도 보존 정책을 추가한다.
