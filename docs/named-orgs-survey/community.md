# 묶음: community (개발자 커뮤니티 12곳)

조사 날짜: 2026-10-23 (한국 시간). 기간: 2025-11-01 ~ 2026-10-31.

공통 메모:

- 봇 UA로 curl만 썼다. 같은 호스트는 1초 이상, gdg.community.dev는 `Crawl-delay: 2`를 지켰다.
- WebSearch는 이 묶음에서 6회 쓴 뒤 세션 예산(200회, 모든 에이전트 공용)이 바닥나 더 쓰지 못했다. 그래서 모음 사이트 `site:` 검색은 거의 하지 못했다.
- 대신 ticketa 숨은 API(`GET https://vlizxsubseudvtswwsjd.supabase.co/functions/v1/events?locale=ko`)를 1회 불러 지난 행사 포함 전체 135건(2025-05-31 ~ 2026-12-12)을 받았다. 목록 요청이지 검색 요청이 아니다. 아래 "모음 사이트" 칸의 ticketa 판정은 이 135건 기준이다.
- ticketa 응답에는 주최 이름이 없고 `organization_id`만 있다. 사이트맵에 주최자 slug(`gdg-incheon`, `gdg-korea-android`, `gdgbusan`, `droidknights`, `letswift` 등)가 있지만 ID와 짝지을 수 없다.
- "이벤터스·OKKY·Luma·Meetup·위비티·Festa 미확인"은 검색 예산 소진 때문이다. 없다는 뜻이 아니다.

## AWSKRUG(AWS 한국 사용자 모임)

- 조사 범위: Meetup 그룹 예정·지난 첫 화면, AWS Community Day Korea 검색. 직접 요청 3회(robots, 예정, 지난).
- 공지 위치:
  - 이벤트 목록 페이지 `https://www.meetup.com/awskrug/events/` — 읽기: 내장 데이터 / robots: 허용 / EVENT_SITES 기준. 오늘 예정 7건, 그룹 누적 867건(`PAST` 859건). `/gql*`, `*/events/rss/*`·`*/events/atom/*`는 금지다
  - 이벤트 목록 페이지 `https://www.meetup.com/awskrug/events/?type=past` — 읽기: 내장 데이터 / robots: 허용(`type=`에 맞는 금지 규칙 없음) / 첫 화면은 최근 10건(`first:10`, `hasNextPage: true`). 다음 쪽은 `/gql*`이라 금지
  - 모음 사이트 `https://event-us.kr/awskrug/event` — 읽기: 미확인(요청 안 함) / robots: 미확인 / 대형 행사(Community Day 2024, AWS Community Builders Day 2026)가 이벤터스 주최자 페이지에 있다(검색 근거)
- 약관: Meetup은 EVENT_SITES 기준. 원문은 Cloudflare 확인 화면이라 못 받았다. 검색 근거 "5.4 … (a) extract data from the Platform for a commercial purpose not permitted by these Terms". 이벤터스도 EVENT_SITES 기준(비회원 포함 복제·제3자 제공 금지)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 약 80~100건(추정), 후원 발견 0건
  - 추정 근거: 첫 화면의 지난 10건이 2026-09-08 ~ 10-21(44일)이다. 같은 기간 예정 5건(10-26 ~ 10-29)이 더 있다. 이벤터스 소개문 "매년 100여 회의 소모임"(검색 근거)
  - 근거 목록: `https://www.meetup.com/awskrug/events/?type=past`, `https://www.meetup.com/awskrug/events/`
  - AWSKRUG 데브옵스 #DevOps 소모임 26번째 밋업 — 2026-09-15 — 밋업 — 국내 — 주최 — 모음 사이트: 찾지 못함(ticketa 없음, 그 외 미확인) — 근거: `https://www.meetup.com/awskrug/events/316366209/`(목록 데이터)
  - AWSKRUG 데이터 모임 X Apache Airflow 한국 사용자 모임 — 2026-09-18 — 밋업 — 국내 — 주최(공동) — 모음 사이트: 찾지 못함 — 근거: 목록 데이터 `316306742`
  - AWSKRUG #AIEngineering 소모임 — 2026-09-29 — 밋업 — 국내 — 주최 — 모음 사이트: 찾지 못함 — 근거: 목록 데이터 `316405144`
  - AWSKRUG 서버리스 #Serverless 소모임 — 2026-10-14 — 밋업 — 국내 — 주최 — 모음 사이트: 찾지 못함 — 근거: 목록 데이터 `316773011`
  - AWSKRUG #Busan 지역 소모임 — 2026-10-26 — 밋업 — 국내(부산) — 주최 — 모음 사이트: 찾지 못함 — 근거: 목록 데이터 `316892907`
  - 대형 행사: AWS Community Builders Day 2026 — 2026-01-24 — 컨퍼런스 — 국내(강남 센터필드) — 주최(이벤터스 awskrug 주최자 페이지) — 모음 사이트: 이벤터스 — 근거: 검색 근거 `https://event-us.kr/awskrug/event/118695`
  - AWS Community Day Korea 2025: 미확인. 2024는 11.2~3(검색 근거 `event-us.kr/awskrug/event/92849`). 2025 회차 근거를 찾지 못했다
- 예정(2026-11 이후): Kiro 한국 사용자 모임(2026-11-04), AWSKRUG #Junior 소모임(2026-11-05). 둘 다 Meetup
- 메모: 소모임 밋업이 주 1~2회 열린다. 이번에 본 행사는 모두 오프라인(`PHYSICAL`)이다. AWS Student Community Day 2026(7.4)은 대학 학생 모임 8곳이 주최해 세지 않았다(검색 근거). ticketa의 AWS 관련 행사(organization 88)는 AWSKRUG와 연결 근거가 없다.

## GDG Korea(국내 지역 챕터)

- 조사 범위: gdg.community.dev 챕터 8곳(서울, 인천, Campus Korea, Korea Android, 부산, Golang Korea, 대전, 판교) 첫 화면. 송도(`gdg-songdo` → 301 `xx-gdg-songdo` → 404). 직접 요청 10회. 다른 국내 챕터(Cloud Korea, 대구, 광주 등)는 보지 않았다.
- 공지 위치:
  - 이벤트 목록 페이지 `https://gdg.community.dev/{챕터}/` — 읽기: 내장 데이터 / robots: 허용(`Crawl-delay: 2`) / EVENT_SITES 기준. 지난 행사는 첫 화면 4건만 내장된다. 다음 쪽 `/api/`는 금지. 공동 주최 행사가 양쪽 챕터에 같이 나온다(`include_cohosted_events=true`)
  - 오늘 8개 챕터 모두 예정 0건이다. ticketa에는 DEVFEST INCHEON 2026(12-12)이 이미 있다
  - 모음 사이트 `https://ticketa.co/organizers/gdg-incheon` 등 — 읽기: 숨은 API(EVENT_SITES 기준) / robots: 허용 / 인천·Korea Android·부산·대전·판교·Golang Korea 행사가 올라온다
  - 모음 사이트 이벤터스 `event-us.kr/gdgcampuskorea` — GDG Campus Korea DevFest 2025가 있다(검색 근거)
- 약관: EVENT_SITES 기준. GDG 참가 약관에 자동 수집 조항이 없다. 바닥글의 Google 약관은 robots.txt를 어기는 자동 접근을 금지한다
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 약 21건(본 8개 챕터, 중복 제외), 후원 발견 0건
  - 근거 목록: `https://gdg.community.dev/gdg-seoul/`, `/gdg-incheon/`, `/gdg-campus-korea/`, `/gdg-korea-android/`, `/gdg-busan/`, `/gdg-golang-korea/`, `/gdg-daejeon/`, `/gdg-pangyo/`
  - 챕터별: 서울 2, 인천 3, Campus Korea 3, Korea Android 4 이상(4번째가 기간 안이라 더 있을 수 있다), 부산 3, Golang Korea 3, 대전 2, 판교 쪽 1(GDG Cloud Korea 주최 Build with AI Cloud x Pangyo 2026)
  - GDG DevFest Cloud x Seoul 2025 — 2025-11-30 — 컨퍼런스 — 국내 — 주최(GDG 서울) — 모음 사이트: ticketa 없음, 그 외 미확인 — 근거: `https://gdg.community.dev/gdg-seoul/`
  - DEVFEST INCHEON 2025 — 2025-12-06 — 컨퍼런스 — 국내(인천 연수구) — 주최(GDG 인천) — 모음 사이트: ticketa — 근거: ticketa `bmbtaysp`. GDG 페이지 같은 날 제목은 "GDG Incheon Meetup - Road to Devfest 2025"
  - Build with AI x GDG Busan 2026 - AI Hackathon — 2026-04-25 — 해커톤 — 국내(부산) — 주최(GDG 부산) — 모음 사이트: ticketa — 근거: `https://gdg.community.dev/gdg-busan/`, ticketa `6u6vfsn9`
  - 2026 Google I/O Extended - GDG Korea Android — 2026-07-25 — 컨퍼런스 — 국내 — 주최 — 모음 사이트: ticketa — 근거: `https://gdg.community.dev/gdg-korea-android/`, ticketa `vcp5wmp4`
  - 2026 I/O Extended: Hack the Beat — 2026-08-29 — 해커톤(제목 기준) — 국내 — 주최(GDG Campus Korea) — 모음 사이트: ticketa 없음, 그 외 미확인 — 근거: `https://gdg.community.dev/gdg-campus-korea/`
- 예정(2026-11 이후): DEVFEST INCHEON 2026(2026-12-12, ticketa `8dedugs6`). GDG 페이지에는 아직 없다
- 메모: 챕터마다 연 3회 주기가 보인다(DevFest 11~12월, Build with AI 3~5월, I/O Extended 7~9월). Build with AI·I/O Extended는 현장 행사다(생중계 시청 아님). GopherCon Korea 2025는 GDG Golang Korea 행사로 올라와 있어 아래 GopherCon 항목과 겹친다.

## 파이콘 한국(PyCon Korea)

- 조사 범위: 블로그 Atom, 루트 연결. 직접 요청 3회(blog robots, feed, 루트). 2027 서브도메인은 DNS만 조회했다.
- 공지 위치:
  - 공식 행사 사이트 `https://2026.pycon.kr/` — 읽기: CSR / robots: 허용(`ai-train=no`) / EVENT_SITES 기준. 루트 `pycon.kr`은 오늘도 302 → `2026.pycon.kr`. `2027.pycon.kr`은 DNS가 없다
  - 블로그 RSS `https://blog.pycon.kr/feed.xml` — 읽기: 공식 API·RSS(Atom) / robots: robots 없음(GitHub Pages 404) / 10건. 기간 안 글은 1건(2026-08-29 UbuCon·MiniDebConf 부스 후기)뿐이다. 행사 공지 글이 없다. ETag·Last-Modified 있음
  - SNS: GitHub `pythonkr`(EVENT_SITES 기준). 그 외 SNS 주소 미확인
- 약관: 찾지 못함(EVENT_SITES 기준). robots `Content-Signal: search=yes,ai-train=no,use=reference`
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - PyCon Korea 2026 — 2026-08-15~16 — 컨퍼런스 — 국내(동국대) — 주최 — 모음 사이트: ticketa 없음, 그 외 미확인 — 근거: EVENT_SITES 기준
- 예정(2026-11 이후): 없음(2027 공지 신호 없음)
- 메모: 연 1회, 8월. UbuCon Korea X MiniDebConf Korea 2026(8-29)에는 부스만 운영했다(블로그). 주최가 아니라 세지 않았다.

## 프론트엔드개발그룹(FEConf)

- 조사 범위: 새 요청 없음. EVENT_SITES·SOURCE_CANDIDATES와 ticketa 목록으로 판정했다.
- 공지 위치:
  - 공식 행사 사이트 `https://2026.feconf.kr/` — 읽기: SSR / robots: 허용 / EVENT_SITES 기준. 새 회차 신호는 GitHub `fedgkr/feconf{YYYY}` 저장소 생성
  - 모음 사이트 `https://ticketa.co/event/t12vlmil` — 읽기: 숨은 API / robots: 허용 / FEConf 2025·2026 모두 ticketa에 있다
  - SNS: LinkedIn·Facebook(EVENT_SITES 기준, URL 미기록). 블로그·RSS 없음
- 약관: 없음(EVENT_SITES 기준)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - FEConf 2026 — 2026-10-24 — 컨퍼런스 — 국내(롯데월드타워) — 주최 — 모음 사이트: ticketa, 요즘IT 기사(SOURCE_CANDIDATES 기준) — 근거: EVENT_SITES 기준, ticketa `t12vlmil`
- 예정(2026-11 이후): 없음
- 메모: 연 1회. FEConf 2025(2025-08-23)는 기간 밖이다. FEConf 말고 다른 행사는 확인하지 못했다(미확인).

## 드로이드나이츠

- 조사 범위: 새 요청 없음. EVENT_SITES와 ticketa 목록.
- 공지 위치:
  - 공식 행사 사이트 `https://droidknights.dev/` — 읽기: SSR / robots: robots 없음(HTML이 온다, 규칙 0개로 판정) / EVENT_SITES 기준
  - 모음 사이트 `https://ticketa.co/organizers/droidknights` — 읽기: 숨은 API / robots: 허용 / 2025·2026 회차 모두 ticketa에 있다
  - SNS: Facebook·Instagram·YouTube(EVENT_SITES 기준, URL 미기록)
- 약관: 없음(EVENT_SITES 기준)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건, 후원 발견 0건
- 예정(2026-11 이후): 드로이드나이츠 2026 — 2026-11-02 — 컨퍼런스 — 국내(과학기술컨벤션센터) — 주최 — 모음 사이트: ticketa `2o8rdpls`
- 메모: 연 1회. 2025 회차는 2025-06-17이라 기간 밖이다. 2026은 6월에서 11월로 옮겼다.

## let'swift

- 조사 범위: 새 요청 없음. EVENT_SITES와 ticketa 목록.
- 공지 위치:
  - 공식 행사 사이트 `https://letswift.kr/2026/` — 읽기: SSR(+ `.ics`) / robots: 허용 / EVENT_SITES 기준. `/2025/`는 CSR
  - 모음 사이트 `https://ticketa.co/organizers/letswift` — 읽기: 숨은 API / robots: 허용 / 기간 안 3건 모두 ticketa에 있다(organization 27)
  - SNS: GitHub `letswiftconf`, 뉴스레터 저장소, iOS 앱(EVENT_SITES 기준)
- 약관: 없음(EVENT_SITES 기준)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 3건, 후원 발견 0건
  - Let'Swift 2025 : Ember to Stars — 2025-11-24 — 컨퍼런스 — 국내(서울 광진구) — 주최 — 모음 사이트: ticketa — 근거: ticketa `4mhe6h9g`
  - 10 Years of Let'Swift — 2026-04-01 — 밋업(특별 회차, 성격 미확인) — 국내(강남) — 주최 — 모음 사이트: ticketa — 근거: ticketa `kng8hpzs`, EVENT_SITES의 `/20260401/`
  - Let'Swift 2026 — 개발 환경의 변화 워크숍 — 2026-10-08 — 세미나(워크숍) — 국내(강남 코드스쿼드) — 주최 — 모음 사이트: ticketa — 근거: ticketa `vdb8aajs`, EVENT_SITES 기준
- 예정(2026-11 이후): 없음
- 메모: 본 컨퍼런스는 주로 11월이다. 2026은 11월 컨퍼런스 공지가 아직 없다.

## GopherCon Korea

- 조사 범위: GDG Golang Korea 챕터 첫 화면(GDG 항목 요청에 포함), ticketa 목록.
- 공지 위치:
  - 공식 행사 사이트 `https://gophercon.kr/` — 읽기: CSR / robots: 허용 / EVENT_SITES 기준. 제목이 아직 "GopherCon Korea 2025"
  - 이벤트 목록 페이지 `https://gdg.community.dev/gdg-golang-korea/` — 읽기: 내장 데이터 / robots: 허용(`Crawl-delay: 2`) / GopherCon Korea 2025가 이 챕터 행사로 올라와 있다. 주최는 GDG Golang Korea다
  - 모음 사이트 ticketa(organization 20) — 읽기: 숨은 API / robots: 허용 / GopherCon Korea 2025와 Build with AI Golang Korea가 같은 주최 ID다
- 약관: 사이트 약관 없음(EVENT_SITES 기준). GDG는 GDG 항목과 같다
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 3건, 후원 발견 0건
  - GopherCon Korea 2025 — 2025-11-09 — 컨퍼런스 — 국내(코엑스 마곡) — 주최 — 모음 사이트: ticketa — 근거: ticketa `8q6livn5`, GDG Golang Korea 페이지
  - DevFest Pangyo x Golang Korea 2025: BANANA-MAS — 2025-12-23 — 밋업 — 국내(성남) — 공동(GDG 판교 주최) — 모음 사이트: ticketa — 근거: ticketa `mzmth76d`(organization 2), GDG 판교·Golang Korea 페이지
  - 2026 Build with AI Golang Korea — 2026-04-16 — 밋업 — 국내(구로) — 주최 — 모음 사이트: ticketa — 근거: ticketa `871axvkx`
- 예정(2026-11 이후): 없음. GopherCon Korea 2026 공지를 찾지 못했다
- 메모: GopherCon은 연 1회(2023.8, 2024.10, 2025.11). 위 3건은 GDG Korea 건수에도 들어 있다.

## Spring Camp

- 조사 범위: DNS 조회(`springcamp.io`, `www.springcamp.io`, `springcamp.kr` 모두 없음), KSUG 사이트. 직접 요청 3회(ksug robots 301, www robots, 메인).
- 공지 위치:
  - 공식 행사 사이트: 없음. `springcamp.io` DNS 없음(EVENT_SITES 기준, 오늘 다시 조회해도 같다)
  - 커뮤니티 사이트 `https://www.ksug.org/` — 읽기: SSR / robots: robots 없음(GitHub Pages 404) / Last-Modified 2021-05-18. Spring Camp 링크가 없다
  - 모음 사이트 ticketa(organization 87) — 읽기: 숨은 API / robots: 허용 / "스프링캠프 2026"이 있다
  - SNS: Facebook 그룹 `https://www.facebook.com/groups/springkorea/`(요청 안 함), Google 그룹 `https://groups.google.com/forum/#!forum/ksug`
- 약관: 없음(KSUG 사이트에 약관 없음)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - 스프링캠프 2026 — 2026-06-13 — 컨퍼런스 — 국내(서울 서초구) — 주최 — 모음 사이트: ticketa — 근거: ticketa `tufmarzt`
- 예정(2026-11 이후): 없음
- 메모: 공식 사이트 없이 ticketa에만 공지가 보인다. 주최 단체 이름(KSUG 여부)은 미확인이다.

## JSConf Korea

- 조사 범위: 새 요청 없음. EVENT_SITES 기준.
- 공지 위치:
  - 공식 행사 사이트 `https://jsconf.kr/` → `2022.jsconf.kr` — 읽기: SSR / robots: 허용 / EVENT_SITES 기준
  - SNS: URL 미확인
- 약관: 없음(EVENT_SITES 기준)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건, 후원 발견 0건
- 예정(2026-11 이후): 없음
- 메모: 2022 이후 회차가 없다. 저장소 archived. ticketa 135건에도 없다. 활동 중단으로 보인다(공식 중단 공지는 미확인).

## 인프런(인프콘)

- 조사 범위: 새 요청 없음. EVENT_SITES·SOURCE_CANDIDATES 기준.
- 공지 위치:
  - 공식 행사 사이트 `https://infcon.day/` → `inflearn.com/conf/infcon-2024` — 읽기: SSR / robots: 허용(`/conf/`) / EVENT_SITES 기준. `/conf/infcon-2025`·`infcon-2026`은 404
  - 이벤트 목록 페이지 `https://www.inflearn.com/pages?type=event` — 자사 프로모션이다. 최신 2025-12(SOURCE_CANDIDATES 기준)
  - SNS: X `@InflearnConf`(검색 근거, EVENT_SITES 기준)
- 약관: `https://www.inflearn.com/policy/terms-of-service`. 본문은 `/api`라 robots 금지(EVENT_SITES 기준)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건, 후원 발견 0건
- 예정(2026-11 이후): 없음
- 메모: 2022~2024 연 1회(8월). 2025 휴식 공지(검색 근거). 2026 공지 없음. ticketa에도 없다.

## Kotlin User Group Korea

- 조사 범위: kotlinlang.org KUG 목록, kotlin.kr, Meetup, 서울 KUG Medium RSS. 직접 요청 7회.
- 공지 위치:
  - 공식 KUG 목록 `https://kotlinlang.org/community/user-groups/` — robots: 허용 / 한국 항목은 "Korean KUG" `http://kotlin.kr/`, "Seoul KUG" `https://medium.com/seoul-kotlin-user-group` 두 곳이다
  - 커뮤니티 사이트 `http://kotlin.kr/` — 읽기: SSR / robots: 허용(Sitemap 줄만 있다) / Last-Modified 2017-03-03. 최신 글 "코틀린 1.1 릴리즈". RSS `http://kotlin.kr/feed.xml`(요청 안 함)
  - 이벤트 목록 페이지 `https://www.meetup.com/kotlinkr/events/?type=past` — 읽기: 불가 / robots: 허용 / 200이지만 본문이 "Group not found"다
  - 블로그 RSS `https://medium.com/feed/seoul-kotlin-user-group` — 읽기: 공식 API·RSS / robots: 허용(`/feed/` 금지 규칙 없음) / 2건. 최신 2025-02-14. 행사 공지 없음
  - SNS: Facebook 그룹 `https://facebook.com/groups/kotlinkr`, 페이지 `https://facebook.com/kotlinkr`, X `https://twitter.com/kotlinkr`, Slack `kotlinkr.slack.com`(요청 안 함)
- 약관: 약관 없음. kotlin.kr 바닥글 "the docs are licensed under CC BY-NC-ND 4.0"
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건 확인, 후원 발견 0건. 주최 미상 Kotlin 행사 2건
  - Kotlin Multiplatform Meetup — 2025-12-21 — 밋업 — 국내(우아한형제들 루터회관) — 주최 미확인(ticketa organization 52) — 모음 사이트: ticketa — 근거: ticketa `9e2onjft`
  - KotlinConf Extended South Korea — 2026-08-16 — 컨퍼런스(제목 기준) — 국내(서대문구) — 주최 미확인(ticketa organization 52) — 모음 사이트: ticketa — 근거: ticketa `ic97nj1c`
- 예정(2026-11 이후): 미확인
- 메모: 공식 목록에 걸린 두 채널은 2017·2025-02 이후 갱신이 없다. ticketa organization 52가 실제 KUG인지는 미확인이다(상세 페이지는 요청하지 않았다).

## PyTorch KR / TensorFlow KR

- 조사 범위: PyTorch KR 포럼 robots·분류 목록·공지·행사 홍보·RSS·행동 강령, pytorch.kr robots. TensorFlow KR 사이트 robots. 직접 요청 9회.
- 공지 위치:
  - 이벤트 목록 페이지 `https://discuss.pytorch.kr/c/announce/13`(공지 사항) — 읽기: SSR(Discourse 크롤러용 HTML, `tr.topic-list-item`) / robots: 허용 / 30건, 다음 쪽 `?page=1`. 날짜 칸은 최근 활동일이다(작성일 아님). `no-store`
  - 이벤트 목록 페이지 `https://discuss.pytorch.kr/c/promotion/12`(행사&이벤트 홍보) — 읽기: SSR / robots: 허용 / 외부 행사·DACON 대회·채용·교육 홍보가 섞인다. 자체 행사는 공지 사항에 있다
  - 블로그 RSS `https://discuss.pytorch.kr/latest.rss` — 읽기: 공식 API·RSS / robots: 허용 / 전체 최신 30건, 1.2MB. 분류별 RSS `/c/*.rss`와 글별 `/t/*/*.rss`는 robots 금지
  - 공식 사이트 `https://pytorch.kr/` — robots: 허용(`Allow: /`)
  - SNS: Facebook 페이지(공지 "페이스북 페이지를 개설", URL 미확인)
  - TensorFlow KR: `https://tensorflow.kr/`은 자체 서명 인증서라 TLS 실패다. `http://tensorflow.kr/robots.txt`는 `User-agent: *` `Disallow: /` — 읽기: 불가 / robots: 금지. Facebook 그룹 URL은 미확인
- 약관: PyTorch KR `/tos`가 `https://pytorch.kr/coc/`(행동 강령)로 302된다. 자동 수집·재배포 조항이 없다. TensorFlow KR 미확인
- 최근 12개월 행사(2025-11~2026-10): PyTorch KR 주최·주관 5건(관계 미확인 포함), 후원 발견 0건. TensorFlow KR 미확인
  - 파이토치 한국 사용자 모임 제6회 테크 세미나 — 날짜 미확인(공지 최근 활동 2025-11-23) — 세미나 — 국내 — 주최 — 모음 사이트: ticketa 없음, 그 외 미확인 — 근거: `https://discuss.pytorch.kr/t/topic/8213`(목록 데이터)
  - vLLM.KR Community Meetup (5월) — 2026-05(일자 미확인) — 밋업 — 국내 — PyTorchKR 공지로 모집, 주최 관계 미확인 — 모음 사이트: ticketa 없음 — 근거: 목록 데이터 `vllm-kr-community-meetup-5/10285`
  - vLLM.KR Community Meetup (8월) — 2026-08(일자 미확인) — 밋업 — 국내 — 주최 관계 미확인 — 모음 사이트: ticketa 없음 — 근거: 목록 데이터 `vllm-kr-community-meetup-8/11540`
  - KVCache Meetup — 2026-09 전후(일자 미확인) — 밋업 — 국내 — 주최 관계 미확인 — 모음 사이트: ticketa 없음 — 근거: 목록 데이터 `kvcache-meetup/11925`
  - PyTorchKR 테크 세미나(Physical AI) — 2026-09-26 ~ 10-22 사이(모집 공지 → 발표자료 공유) — 세미나 — 국내 — 주최 — 모음 사이트: ticketa 없음 — 근거: 목록 데이터 `pytorchkr-physical-ai/12016`, `/12269`
- 예정(2026-11 이후): PyTorch Day Korea 2026 — 11월(일자 미확인) — 컨퍼런스 — 국내 — 주최 — 근거: 공지 "PyTorch Day Korea 2026! 올해 슬로건과 일자를 공개합니다"(`/t/pytorch-day-korea-2026/11390`)
- 메모: PyTorch KR은 테크 세미나가 연 1~2회다(2022부터 6회 이상). 2025년 3월 컨퍼런스도 있었다(기간 밖). NVIDIA AI Day Seoul 회원 초대 공지는 NVIDIA 행사라 세지 않았다. TensorFlow KR은 사이트가 robots 전체 금지라 활동 여부를 확인하지 못했다.

## 묶음 요약

- 기간 안 행사 0건: 드로이드나이츠(2026-11-02 예정이라 기간 밖), JSConf Korea(2022 이후 없음), 인프콘(2025 휴식, 2026 공지 없음). Kotlin User Group Korea는 공식 채널이 2017·2025-02 이후 멈췄고, Kotlin 행사 2건은 주최 미상이다.
- 읽기 불가: TensorFlow KR(robots 전체 금지, HTTPS 자체 서명), Meetup `kotlinkr`(그룹 없음). Spring Camp는 공식 사이트가 없어 ticketa에만 보인다.
- 15건 초과: AWSKRUG(Meetup 소모임, 연 80~100건 추정), GDG Korea(본 8개 챕터만 약 21건). 둘 다 첫 화면만 내장 데이터고 다음 쪽은 robots 금지다.
- ticketa 135건에 이 묶음 행사가 많다: GDG 인천·Android·부산·대전·판교·Golang, FEConf, 드로이드나이츠, let'swift, GopherCon, 스프링캠프. PyCon·PyTorch KR·AWSKRUG 소모임·GDG 서울·Campus Korea는 ticketa에 없다.
- WebSearch 예산이 바닥나 이벤터스·OKKY·Luma·Meetup 등 다른 모음 사이트 등장 여부는 대부분 미확인이다.
