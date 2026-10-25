# 네임드 주최 76곳 조사 결과

조사 날짜: 2026-10-23 (한국 시간). 행사를 센 기간: 2025-11-01 ~ 2026-10-31.

[NAMED_ORGS.md](NAMED_ORGS.md)의 후보 76곳을 조사했다. 무엇을 행사로 셀지는 그 문서 "결정" 절을 따랐다. 주최마다 네 가지를 봤다.

1. 행사 공지가 어디 올라오는가
2. 봇이 읽을 수 있는가(robots.txt, 약관, 읽기 방식)
3. 기간 안에 행사를 몇 번 열었는가
4. 그 행사가 행사 모음 사이트에도 올라왔는가

이 문서는 어느 수집 방식을 쓸지 정하지 않는다.

조사 방법은 [SOURCE_CANDIDATES.md](SOURCE_CANDIDATES.md)와 같다. 봇 UA로만 요청했고, 같은 호스트에는 1초 간격을 뒀고, 막힌 곳은 우회하지 않았다. 과거 행사와 모음 사이트 등장 여부는 웹 검색으로도 찾았고 "검색 근거"로 표시했다.

주최별 상세(공지 위치 URL, 약관 인용, 행사 목록)는 [named-orgs-survey/](named-orgs-survey/)에 묶음별로 있다. 상세 파일이 가리키는 `scratchpad/survey/raw/` 원본은 저장소에 넣지 않았다.

## 한계

- **웹 검색 한도 소진.** 세션 공용 웹 검색 한도(200회)가 조사 초반에 바닥났다. 그래서 다음이 대부분 "미확인"이다.
  - 모음 사이트 등장 여부(`site:` 검색)
  - 후원만 한 행사
  - 일부 계열사(LG유플러스, SK AX, SK플래닛, 42dot, 현대오토에버, NHN Commerce 등)
  - 모음 사이트 등장 여부는 2026-10-25 재조사에서 표본 58건으로 다시 봤다("재조사 결과" 절).
- **"미확인"은 "없음"이 아니다.** 아래 표의 모음 사이트 칸은 확인된 것만 적었다.
- **행사 수는 하한값이다.** 찾은 것만 셌다.
- **ticketa는 예외다.** 커뮤니티 묶음이 ticketa 전체 목록 135건을 1회 받아 직접 대조했다. 그래서 커뮤니티 행사의 ticketa 등장 여부는 확인됐다.
- **조사 규칙 이탈:**
  - Cursor 조사 중 Luma 개별 행사 페이지 2곳(`luma.com/2s524ldj`, `luma.com/6y8qjtgr`)을 캘린더로 잘못 알고 요청했다. 개별 공고 상세는 요청하지 않는 규칙이었다.
  - 주최 하나당 직접 요청 기준(10회 안팎)을 넘었다. 삼성·LG·현대자동차그룹은 11~14회, KT는 약 14회다. 계열사 여러 호스트에 나눠 보낸 요청이다.

## 재조사 계획 (완료 2026-10-25)

결과는 아래 "재조사 결과" 절이다.

사용자가 정한 순서: 체크를 먼저 하고(72곳), 모음 사이트 등장 여부는 새 세션에서 웹 검색으로 다시 조사한다.

- 목적: 체크한 주최의 행사가 모음 사이트에도 올라왔는지 확인해 "모음 사이트에서 잡히는 비율"을 낸다. 이 비율은 "주최별 직접 수집"과 "모음 사이트 + 주최 이름 필터" 중 하나를 고를 때 근거다.
- 대상: 이 문서와 [named-orgs-survey/](named-orgs-survey/)에서 찾은 행사 중 체크한 72곳의 것. AWSKRUG·GDG처럼 15건을 넘는 곳은 대표 행사만 본다.
  - 2026-10-25에 되살린 교육 프로그램 8곳도 대상이다. 이 문서에 없으니 행사 목록부터 찾는다([NAMED_ORGS.md](NAMED_ORGS.md) 9절).
- 순서: 수집 방식(계획서 결정 대기 1·2번)보다 이 재조사를 먼저 한다(2026-10-25).
- 모음 사이트: 이벤터스, ticketa, OKKY, Luma, Meetup, 위비티, 링커리어. 커뮤니티 행사의 ticketa 등장은 이미 확인했다.
- 한도: 웹 검색은 세션당 200회이고, 같은 세션의 서브에이전트가 이 한도를 나눠 쓴다. 행사 약 150건 × 모음 사이트 7곳은 200회를 넘는다. 에이전트를 나눠 돌리면 에이전트마다 검색 횟수를 미리 배정한다.
- 멈추는 조건: 표본 몇십 건만으로도 비율이 뚜렷하게 나오면 중간에 멈춘다.

## 재조사 결과 (2026-10-25)

확인 날짜: 2026-10-25 KST(한국 시간). 모음 사이트 직접 요청은 16:01~16:29에 했다. 대상 기간은 위와 같다(2025-11-01 ~ 2026-10-31).

### 결론

- 표본 58건 중 31건(**53%**)이 모음 사이트 7곳 중 한 곳 이상에 올라왔다.
  - 95% 신뢰구간(confidence interval — 진짜 비율이 들어 있을 법한 범위)은 41~66%다.
  - 묶음 크기로 가중해도 53%다.
- 같은 행사의 다른 회차만 올라온 것까지 치면 40건(69%)이다. 예: 코드게이트는 2025 회차만 이벤터스에 있다.
- 사이트를 늘려도 53%에서 멈춘다. 이벤터스·ticketa·Luma·링커리어·OKKY 5곳이면 다 잡히고, Meetup·위비티는 더하는 몫이 없다.
- ○도 △도 없는 18건(31%)은 7곳 어디에도 없었다. 대기업 4, 해외 빅테크 3, 동아리 3, 대회 3건 등이다.

### 방법

- 모집단(population — 표본을 뽑는 전체 목록): [named-orgs-survey/](named-orgs-survey/)에서 찾은 기간 안 행사 159건. 76곳 조사 134건과 교육 프로그램 25건이다.
  - 교육생 전용·회원 전용으로 확인된 행사는 뺐다.
  - AWSKRUG·GDG처럼 행사가 많은 곳은 조사 파일에 적힌 대표 행사만 들어 있다.
- 표본: 묶음마다 무작위로 뽑았다(시드 20261025). 33건을 먼저 봤다. 45%가 나와 30~70% 사이라서 묶음마다 3건씩 25건을 더 뽑았다(시드 20261026, 공공기관은 남은 1건).
- 멈춘 이유: 58건에서 신뢰구간 41~66%가 30~70% 안에 다 들어갔다. 표본을 더 늘려도 30% 미만이나 70% 초과가 나올 가능성이 낮다고 봤다. "30~70%면 늘린다"는 규칙을 문자 그대로 따르면 더 늘려야 한다. 이 판단은 사용자 확인이 필요하다.
- 판정:
  - ○ 있음: 같은 회차 공고가 그 사이트에 있다.
  - △ 다른 회차: 같은 행사의 다른 연도·기수·시즌만 있다.
  - × 찾지 못함: 아래 방법으로 찾았는데 없었다.
  - ? 미확인: 요청이 막혀 보지 못했다.
- 사이트별로 찾은 방법:

| 사이트 | 방법 | robots | 약관 메모 |
| --- | --- | --- | --- |
| 이벤터스 | 검색 API `POST https://api.event-us.kr/api/v1/engine/search`를 직접 받았다. 지난 행사도 나온다 | API 호스트 robots 없음(404) | 제13조: 비회원도 정보 복제·제3자 제공 금지 |
| ticketa | 화면 JS에서 새 주소 `GET https://vlizxsubseudvtswwsjd.supabase.co/functions/v1/home?locale=ko`를 찾아 목록 136건(예정 21, 지난 115)을 받아 대조했다. 이 응답이 지난 행사를 전부 주는지는 미확인이다. 커뮤니티 묶음이 쓴 `/functions/v1/events`는 404로 바뀌었다 | 허용 | — |
| OKKY | `https://okky.kr/events/it?keyword=`와 `/community/gathering-competition?keyword=`를 직접 받았다(SSR) | `/api/`만 금지 | 쓰기만 금지 |
| 위비티 | `https://www.wevity.com/?c=find&s=1&sp=contents&sw=` 검색을 직접 받았다(SSR, 지난 공모전 포함) | 허용 | — |
| 링커리어 | 사이트 검색은 SSR에 결과가 없다(광고 5건만). 웹 검색으로 찾았다 | 허용 | 회원 자동화 금지 |
| Luma | 검색이 CSR이다. 웹 검색으로 찾았다 | Googlebot 그룹만 있음 | 공개 인터페이스 외 접근 금지 |
| Meetup | robots가 `/*?keywords=*`를 금지한다. 웹 검색으로 찾았다 | 검색 경로 금지 | — |

- 링커리어·Luma·Meetup 칸은 모두 **검색 근거**다. 웹 검색 1회에 세 사이트를 같이 걸러 행사당 1회 썼다(소마 부산 2건은 1회로 같이 봤다).
- 사용량: 웹 검색 79회(표본 57, 교육 목록 22). 직접 요청은 이벤터스 88, OKKY 146, 위비티 88, ticketa 약 25(화면 JS 22개 포함), robots 9. 같은 호스트에는 1.1초 간격을 뒀다.
- 막힌 것: 위비티가 `if(kakao)` 검색에 403을 줬다. 다시 요청하지 않았다(그 칸은 ?).

### 비율

전체: 31/58 = 53%(다른 회차 포함 40/58 = 69%). 처음 33건은 45%, 더 뽑은 25건은 64%였다.

묶음별(묶음마다 6~7건이라 구간이 넓다):

| 묶음 | 모집단 | 표본 | ○ | ○+△ |
| --- | --- | --- | --- | --- |
| 국내 대기업 | 22 | 7 | 2 (29%) | 3 (43%) |
| 국내 IT 플랫폼 | 17 | 7 | 5 (71%) | 6 (86%) |
| 국내 게임사 | 15 | 7 | 5 (71%) | 5 (71%) |
| 해외 빅테크·AI | 23 | 7 | 3 (43%) | 4 (57%) |
| 개발 동아리 | 14 | 6 | 1 (17%) | 3 (50%) |
| 개발자 커뮤니티 | 22 | 6 | 5 (83%) | 6 (100%) |
| 대회·해커톤 브랜드 | 17 | 7 | 3 (43%) | 4 (57%) |
| 공공기관 | 4 | 4 | 3 (75%) | 3 (75%) |
| 교육 프로그램 | 25 | 7 | 4 (57%) | 6 (86%) |

사이트별 — 한 곳만 읽을 때:

| 사이트 | ○ | ○+△ |
| --- | --- | --- |
| 이벤터스 | 14 (24%) | 23 (40%) |
| 위비티 | 8 (14%) | 9 (16%) |
| OKKY | 7 (12%) | 11 (19%) |
| 링커리어 | 7 (12%) | 11 (19%) |
| ticketa | 5 (9%) | 5 (9%) |
| Luma | 5 (9%) | 5 (9%) |
| Meetup | 0 | 0 |

사이트별 — 하나씩 더할 때(매번 가장 많이 늘리는 곳을 더함, ○ 기준):

1. 이벤터스 → 14/58 (24%)
2. + ticketa → 19/58 (33%)
3. + Luma → 24/58 (41%)
4. + 링커리어 → 29/58 (50%)
5. + OKKY → 31/58 (53%)
6. + Meetup·위비티 → 31/58 (53%, 늘지 않음)

위비티는 단독으로는 2위지만 공모전만 있어서 이벤터스·링커리어·OKKY와 겹친다. 위비티에만 있던 행사는 없다.

### 표본 목록

칸 기호는 "방법"의 판정을 따른다.

| # | 묶음 | 행사 | 이벤터스 | ticketa | OKKY | Luma | Meetup | 위비티 | 링커리어 | 판정 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 대기업 | kt cloud 웨비나(2025-12) | △ | × | △ | × | × | × | × | △ |
| 2 | 대기업 | Claude Code Builder Hackathon(SK·Anthropic) | × | × | × | × | × | × | × | × |
| 3 | 대기업 | LG AI Insight 2026 | × | × | × | × | × | × | × | × |
| 4 | 대기업 | LG Prompt-on Challenge 2026 | × | × | × | × | × | × | × | × |
| 5 | IT 플랫폼 | 업스테이지 퇴근길 AX 문서 자동화 밋업(07-23) | △ | × | × | × | × | × | × | △ |
| 6 | IT 플랫폼 | if(kakao)26 | × | ○ | × | × | × | ? | × | ○ |
| 7 | IT 플랫폼 | 업스테이지 Solar Open Day | × | × | × | ○ | × | × | × | ○ |
| 8 | IT 플랫폼 | MUSINSA PATTERN '26 | ○ | × | ○ | × | × | × | × | ○ |
| 9 | 게임사 | 제2회 바르코 보이스 게임 제작 공모전(NC AI) | ○ | × | × | × | × | ○ | ○ | ○ |
| 10 | 게임사 | NYPC 2026(넥슨) | ○ | × | × | × | × | ○ | △ | ○ |
| 11 | 게임사 | IndieGo 2026(스마일게이트) | × | × | × | × | × | ○ | ○ | ○ |
| 12 | 게임사 | 비버롹스 2025(스마일게이트) | × | × | × | × | × | × | × | × |
| 13 | 해외 빅테크·AI | 제미나이 3 해커톤(Google, 서울) | × | × | × | × | × | × | × | × |
| 14 | 해외 빅테크·AI | AWS Partner Summit Seoul 2026 | × | × | × | × | × | × | × | × |
| 15 | 해외 빅테크·AI | Swift Student Challenge 2026 | × | × | × | × | × | × | × | × |
| 16 | 해외 빅테크·AI | Cursor Hackathon Seoul(02-07) | × | × | × | ○ | × | × | × | ○ |
| 17 | 동아리 | 두유톤(GDGoC 삼육대) | × | × | × | × | × | × | × | × |
| 18 | 동아리 | 디프만 19기 모집 | × | × | × | × | × | × | △ | △ |
| 19 | 동아리 | 디프만 18기 런칭데이 | △ | × | × | × | × | × | × | △ |
| 20 | 커뮤니티 | PyCon Korea 2026 | △ | × | × | × | × | × | × | △ |
| 21 | 커뮤니티 | 2026 Build with AI Golang Korea | × | ○ | × | × | × | × | × | ○ |
| 22 | 커뮤니티 | 스프링캠프 2026 | × | ○ | × | × | × | × | × | ○ |
| 23 | 대회 브랜드 | UCPC 2026 | × | × | × | × | × | × | × | × |
| 24 | 대회 브랜드 | 제33회 하계 해킹캠프(POC) | × | × | × | × | × | × | × | × |
| 25 | 대회 브랜드 | 2026 핵테온 세종 경진대회 | ○ | × | ○ | × | × | ○ | ○ | ○ |
| 26 | 대회 브랜드 | Zer0Con 2026 | × | × | × | × | × | × | × | × |
| 27 | 공공기관 | 2026 오픈소스 개발자대회(NIPA) | × | × | ○ | × | × | × | × | ○ |
| 28 | 공공기관 | AINEX 2026(NIA) | ○ | × | × | × | × | × | × | ○ |
| 29 | 공공기관 | 국내 sLLM 파인튜닝 챌린지(NIA AI Hub) | × | × | × | × | × | × | × | × |
| 30 | 대기업 | SAIF 2026(삼성) | ○ | × | ○ | × | × | × | × | ○ |
| 31 | 대기업 | Pleos Playground 앱 공모전(현대차·기아) | × | × | × | × | × | ○ | ○ | ○ |
| 32 | 대기업 | LG SPARK 2026 | × | × | × | × | × | × | × | × |
| 33 | IT 플랫폼 | 업스테이지 AI에게 일 잘 시키는 기술 세미나 | ○ | × | × | × | × | × | × | ○ |
| 34 | IT 플랫폼 | 업스테이지 Scaling Parametric Knowledge 세미나 | × | × | × | × | × | × | × | × |
| 35 | IT 플랫폼 | Envisioning the future of AI @ ICML 2026(업스테이지 후원) | × | × | × | ○ | × | × | × | ○ |
| 36 | 게임사 | NDC26(넥슨) | ○ | × | ○ | × | × | × | × | ○ |
| 37 | 게임사 | 메이플스토리 글로벌 개발 콘테스트(넥슨) | × | × | ○ | × | × | ○ | × | ○ |
| 38 | 게임사 | 코파톤(크래프톤·CJ올리브영) | × | × | × | × | × | × | × | × |
| 39 | 해외 빅테크·AI | Snowflake Data for Breakfast 서울(2026-03) | × | × | △ | × | × | × | × | △ |
| 40 | 해외 빅테크·AI | Cursor Hackathon Seoul 3rd | × | × | × | ○ | × | × | × | ○ |
| 41 | 해외 빅테크·AI | Push to Prod SEOUL(Anthropic 공동) | × | × | × | ○ | × | × | × | ○ |
| 42 | 동아리 | 큐시즘 33기 전시회 | ○ | × | × | × | × | × | × | ○ |
| 43 | 동아리 | ONE WAVE 해커톤 특강(GDGoC 연합) | × | × | × | × | × | × | × | × |
| 44 | 동아리 | Build with AI 2026 - Konkuk University(GDGoC) | × | × | × | × | × | × | × | × |
| 45 | 커뮤니티 | GopherCon Korea 2025 | × | ○ | △ | × | × | × | × | ○ |
| 46 | 커뮤니티 | 2026 I/O Extended: Hack the Beat | ○ | × | × | × | × | × | × | ○ |
| 47 | 커뮤니티 | FEConf 2026 | × | ○ | × | × | × | × | × | ○ |
| 48 | 대회 브랜드 | 2025 ICPC Seoul Regional | △ | × | △ | × | × | ○ | ○ | ○ |
| 49 | 대회 브랜드 | 코드게이트 2026 국제해킹방어대회 | △ | × | × | × | × | × | × | △ |
| 50 | 대회 브랜드 | JunctionX Korea 2026 | △ | × | × | × | × | △ | ○ | ○ |
| 51 | 공공기관 | 공공 웹사이트 불법광고 탐지 도구 개발 공모전(NIA) | ○ | × | ○ | × | × | ○ | × | ○ |
| 52 | 교육 프로그램 | 소마 부산센터 과정설명회(2026-02-05) | ○ | × | × | × | × | × | × | ○ |
| 53 | 교육 프로그램 | 소마 17기 부산센터 연수생 모집 | ○ | × | × | × | × | × | △ | ○ |
| 54 | 교육 프로그램 | Apple Developer Academy 포트폴리오 챌린지 2026(10-26) | △ | × | × | × | × | × | × | △ |
| 55 | 교육 프로그램 | 크래프톤 정글 SW-AI Lab 12기 등 모집 | △ | × | × | × | × | × | ○ | ○ |
| 56 | 교육 프로그램 | SSAFY 17기 모집 | × | × | × | × | × | × | △ | △ |
| 57 | 교육 프로그램 | 크래프톤 정글 2026 하반기 통합 설명회 | ○ | × | × | × | × | × | × | ○ |
| 58 | 교육 프로그램 | 카카오테크 캠퍼스 3기 최종 발표회 | × | × | × | × | × | × | × | × |

근거 URL(검색 근거 표시가 없으면 직접 받아 확인한 것):

- 1. kt cloud 웨비나(2025-12): `event-us.kr/ktcloud/event/129118(2026-07 회차)`, `okky.kr/articles/1559626(2026-06 회차)`
- 5. 업스테이지 퇴근길 AX 문서 자동화 밋업(07-23): `event-us.kr/Upstage2020/event/126605(06-18 회차)`
- 6. if(kakao)26: `ticketa.co/event/lyohvjgz`
- 7. 업스테이지 Solar Open Day: `luma.com/nv57vgh9(검색 근거)`
- 8. MUSINSA PATTERN '26: `event-us.kr/musinsapattern26/event/133401`, `okky.kr/articles/1562663`
- 9. 제2회 바르코 보이스 게임 제작 공모전(NC AI): `event-us.kr/kga/event/117312`, `wevity ix=103547`, `linkareer.com/activity/282761(검색 근거)`
- 10. NYPC 2026(넥슨): `event-us.kr/nypc/event/121696`, `wevity ix=107947`, `linkareer.com/activity/254539(2025 회차, 검색 근거)`
- 11. IndieGo 2026(스마일게이트): `wevity ix=105914`, `linkareer.com/activity/307717(검색 근거)`
- 16. Cursor Hackathon Seoul(02-07): `luma.com/2s524ldj`
- 18. 디프만 19기 모집: `linkareer.com/activity/302174(18기, 검색 근거)`
- 19. 디프만 18기 런칭데이: `event-us.kr/depromeet/event/101103(16기)`
- 20. PyCon Korea 2026: `event-us.kr/pyconkr/event/92861(2024 회차)`
- 21. 2026 Build with AI Golang Korea: `ticketa.co/event/871axvkx`
- 22. 스프링캠프 2026: `ticketa.co/event/tufmarzt`
- 25. 2026 핵테온 세종 경진대회: `event-us.kr/hacktheon2026/event/122885`, `okky.kr/articles/1553905`, `wevity ix=105938`, `linkareer.com/activity/309923(검색 근거)`
- 27. 2026 오픈소스 개발자대회(NIPA): `okky.kr/articles/1559106`
- 28. AINEX 2026(NIA): `event-us.kr/sek/event/134344`
- 30. SAIF 2026(삼성): `event-us.kr/saif2026/event/135379`, `okky.kr/articles/1564066`
- 31. Pleos Playground 앱 공모전(현대차·기아): `wevity ix=111802`, `linkareer.com/activity/358198(검색 근거)`
- 33. 업스테이지 AI에게 일 잘 시키는 기술 세미나: `event-us.kr/Upstage2020/event/125350`
- 35. Envisioning the future of AI @ ICML 2026(업스테이지 후원): `luma.com/49xc08fw(검색 근거)`
- 36. NDC26(넥슨): `event-us.kr/ndc26/event/126593`, `okky.kr/articles/1558682`
- 37. 메이플스토리 글로벌 개발 콘테스트(넥슨): `okky.kr/articles/1558127`, `wevity ix=107956`
- 39. Snowflake Data for Breakfast 서울(2026-03): `okky.kr/articles/1491560(2024 회차)`
- 40. Cursor Hackathon Seoul 3rd: `luma.com/6y8qjtgr(2026-10-23 조사)`
- 41. Push to Prod SEOUL(Anthropic 공동): `luma.com/elhey8nv(검색 근거)`
- 42. 큐시즘 33기 전시회: `event-us.kr/kusitsm/event/126748`
- 45. GopherCon Korea 2025: `ticketa.co/event/8q6livn5`, `okky.kr/articles/1513373(2024 회차)`
- 46. 2026 I/O Extended: Hack the Beat: `event-us.kr/gdgcampuskorea/event/131744`
- 47. FEConf 2026: `ticketa.co/event/t12vlmil`
- 48. 2025 ICPC Seoul Regional: `wevity ix=101863`, `linkareer.com/activity/267716(검색 근거)`, `event-us.kr/mybBtK1tSRVm/event/71937(2023 회차)`, `okky.kr/articles/1470866(2023 회차)`
- 49. 코드게이트 2026 국제해킹방어대회: `event-us.kr/impacts/event/106695(2025 회차)`
- 50. JunctionX Korea 2026: `linkareer.com/activity/336511(검색 근거)`, `event-us.kr/shift/event/46285(2022 Junction Asia)`, `wevity ix=88705(2024 Junction Asia)`
- 51. 공공 웹사이트 불법광고 탐지 도구 개발 공모전(NIA): `event-us.kr/aigongmo/event/135354`, `okky.kr/articles/1564401`, `wevity ix=110998`
- 52. 소마 부산센터 과정설명회(2026-02-05): `event-us.kr/asmbusan/event/120161`
- 53. 소마 17기 부산센터 연수생 모집: `event-us.kr/asmbusan/event/121082`, `linkareer.com/activity/294431(서울센터 공고, 검색 근거)`
- 54. Apple Developer Academy 포트폴리오 챌린지 2026(10-26): `event-us.kr/appledevacademy/event/125061·125063(2026-05 시즌 1·2)`
- 55. 크래프톤 정글 SW-AI Lab 12기 등 모집: `linkareer.com/activity/291492(검색 근거)`, `event-us.kr/allforyoung/event/96855(8기)`
- 56. SSAFY 17기 모집: `linkareer.com/activity/178546(12기, 검색 근거)`
- 57. 크래프톤 정글 2026 하반기 통합 설명회: `event-us.kr/maycan/event/124288`

찾지 못한 것에 대한 메모:

- 15. Swift Student Challenge 2026: Luma에 준비 모임(`luma.com/390vq8re`, 검색 근거)만 있다. 대회 공고는 아니다.
- 23. UCPC 2026: 모음 사이트 중 씽유에만 있다(7곳 밖).
- 38. 코파톤: 링커리어에 커뮤니티 게시글만 있다(공고 페이지 아님, 검색 근거).

### 조사 목록 밖에서 나온 네임드 행사

모음 사이트를 대조하다가 주최 조사 파일에 없던 행사가 나왔다. 주최 조사의 행사 수가 하한값이라는 근거다.

- ticketa: 2025 당근 플랫폼 밋업(2025-11-07, `ticketa.co/event/0hxnlenq`), 2026 당근 Builder Meetup(2026-09-14, `ticketa.co/event/x0u2znh1`), Snowflake World Tour 서울(2026-08-26, `ticketa.co/event/531d8xu4`), Apple 디벨로퍼 아카데미 로드쇼 4건(2026-04-28~05-06), 같은 organization_id의 "디지털 노마드를 위한, 나만의 취향으로 커리어 확장하기"(2026-10-23, `ticketa.co/event/7xbo79th`)와 SHOWCASE26(2026-11-20, 기간 밖 예정). 당근 조사에서는 기간 안 행사를 0건으로 적었다.
- 이벤터스: Snowflake Discover AI 웨비나(2026-02-03, `event-us.kr/snowflakekorea/event/119396`), Snowflake EXPEDITION 웨비나(2026-11-04, `event-us.kr/snowflake2026/event/138459`), SSAFYnity 커리어 파티(2025-12-06, `event-us.kr/ssafy/event/117342`), AI·SW마에스트로 17기 발대식(`event-us.kr/aiswmaestro/event/126393`), 부산 PRE-SOMA(`event-us.kr/presoma/event/135118`), Apple SHOWCASE25(`event-us.kr/appledevacademy/event/116514`)
- Luma: Claude Build Day Seoul(2026-06-16, 검색 근거)
- 링커리어(검색 근거): LG Aimers 8·9기, 퓨처랩 프로토타이핑 챌린지 시즌 3, Upstage×BDAI Skillthon, NC AI Show Your World
- 여러 곳: 2026 코드게이트 AI 스타트업 해커톤(이벤터스 `event-us.kr/hancomedu/event/126525`, 위비티, 링커리어)

### 주최 판정에 쓸 단서

모음 사이트 공고에는 주최 채널 ID가 붙는다. 이번 표본에서 본 것:

- 주최 자신의 채널: 이벤터스 `saif2026`(삼성), `ndc26`(넥슨), `Upstage2020`, `appledevacademy`, `ktcloud`, `musinsapattern26`, `nypc`, `hacktheon2026`. ticketa `organization_id` 89(Apple 디벨로퍼 아카데미).
- 채널 이름이 회차마다 바뀐다: `ndc26`, `saif2026`, `hacktheon2026`, `musinsapattern26`, `snowflake2026`. 같은 Snowflake도 `snowflakekorea`와 `snowflake2026` 두 채널을 쓴다.
- 같은 회사가 ticketa에서 다른 `organization_id`를 쓴다: 당근 24(2025 플랫폼 밋업)와 104(2026 Builder Meetup).
- 대행사·제3자 채널: `maycan`(정글 설명회), `sek`(AINEX), `kga`(바르코 보이스), `impacts`(코드게이트 2025), `hancomedu`(코드게이트 AI 해커톤), `allforyoung`(정글 8기).

### 한계

- **표본이 작다.** 묶음마다 6~7건이라 묶음별 비율은 ±30%p 가까이 흔들릴 수 있다(예: 해외 빅테크 43%의 95% 구간은 16~75%).
- **행사 건수로 가중하지 않았다.** AWSKRUG는 연 80~100건을 Meetup에 올리는데 모집단에 대표 5건만 있고 표본에 뽑히지 않았다. 행사 건수로 세면 Meetup 몫과 전체 비율이 올라간다.
- **검색 근거 3곳.** 링커리어·Luma·Meetup의 ×는 웹 검색에 안 나왔다는 뜻이다. 직접 확인한 "없음"보다 약하다.
- **검색어 의존.** 이벤터스·OKKY·위비티도 사이트 검색 결과를 본 것이다. 제목이 많이 다르면 놓쳤을 수 있다.
- **모집단도 하한값이다.** 위 "조사 목록 밖" 행사처럼 주최 조사에서 빠진 행사가 있다. 이 방법으로는 모음 사이트에 있는 것만 새로 찾을 수 있다. 주최 조사에서도 빠지고 모음 사이트에도 없는 행사는 몇 건인지 모른다.
- 원본(요청 로그, 검색 결과, 집계 스크립트)은 세션 스크래치패드에만 있고 저장소에 넣지 않았다.

## 한눈에 보기

칸의 뜻:

- 행사: 기간 안 주최·주관 건수. 괄호는 후원 발견 건수나 단서다.
- 읽을 수 있는 공지 위치: 봇이 robots·읽기 방식상 받을 수 있는 곳만 적었다. 막힌 곳은 "막힘"으로 따로 적었다.
- 모음 사이트: 등장이 확인된 곳만 적었다. "—"는 확인된 등장이 없다는 뜻이다(미확인 포함). 76곳 표는 2026-10-23 조사 그대로다. 재조사로 확인한 것은 "재조사 결과" 절 표본 목록에 있다.

### 국내 대기업

| 주최 | 행사 | 읽을 수 있는 공지 위치 | 막힘 | 모음 사이트 |
| --- | --- | --- | --- | --- |
| 삼성 | 5 (후원 1) | Samsung Developers 이벤트 목록(SSR), 삼성리서치 SAIF·사진첩(SSR) | 삼성SDS 목록(robots 금지 경로), 뉴스룸(시간 초과) | 이벤터스(SAIF 2026), DACON(SCPC AI 챌린지) |
| LG | 4 (외부 참가 확인 1, 후원 1) | 없음 | LG AI연구원 뉴스(CSR), LG CNS 목록(robots 금지 경로) | — |
| 현대자동차그룹 | 1 | Pleos 25 사이트(SSR, 지난 회차) | Pleos Playground(CSR), Softeer(DNS 없음) | 슈퍼루키·이노포레스트·링커리어(Pleos·기아 공모전) |
| SK | 4 | SKT·SK하이닉스 뉴스룸 RSS(보도자료 전체라 행사 글 드묾) | DEVOCEAN(robots 전체 금지), SK AX 이벤트(CSR) | — |
| KT | 4 (kt cloud, 후원 1) | kt cloud 기술 블로그 RSS·웨비나 목록(SSR) | KT DS(robots 전체 금지), KT 보도자료(CSR) | — |
| 한화 | 0 | 한화비전 이벤트(SSR), 한화시스템 뉴스룸(SSR) | 한화 그룹 뉴스룸(CSR) | — |
| CJ | 2 | cjnews 태그 RSS(사후 기사 위주), 맥소노미 블로그(내장 데이터) | CJ올리브네트웍스(robots 전체 금지) | 링커리어(코파톤, 범위 밖 계열사) |
| 롯데 | 0 (후원 1) | 롯데 그룹 보도자료(SSR) | 롯데이노베이트(CSR) | — |

### 국내 IT 플랫폼

| 주최 | 행사 | 읽을 수 있는 공지 위치 | 막힘 | 모음 사이트 |
| --- | --- | --- | --- | --- |
| 네이버 | 2 | D2 Atom, 보도자료(SSR), 네이버클라우드 교육 목록(내장 데이터) | D2 뉴스(CSR) | 이벤터스 네이버클라우드 주최 페이지(검색 근거) |
| 카카오 | 3 (2건 판단 필요) | tech.kakao.com RSS, 카카오뱅크·카카오클라우드 RSS | `/events`(CSR), Kakao Tech Meet의 festa.io(robots 전체 금지) | — |
| 우아한형제들 | 1 | 기술 블로그 RSS(전체·세미나·공지 카테고리) | 없음 | ticketa(WOOWACON 2026) |
| 토스 | 0 | toss.tech RSS, 토스피드 RSS | 없음 | — |
| 쿠팡 | 0 | Medium RSS, 뉴스룸 RSS | 없음 | — |
| 당근 | 0 | Medium RSS, 채용 블로그(SSR) | 없음 | — |
| LINE | 0 | LY 기술 블로그 한국어 RSS, Tech-Verse(SSR), LINE Plus 보도자료(SSR) | 없음 | — |
| NHN | 1 | NHN Cloud Meetup RSS | 새소식(CSR), NAN 2026 사이트(DNS 없음) | 이벤터스 NHN Cloud 채널 |
| 야놀자 | 0 | 그룹 보도자료·블로그(SSR) | Medium RSS는 2022 이후 멈춤 | — |
| 무신사 | 1 | 기술 블로그 Medium RSS | MUSINSA PATTERN 사이트(CSR), 보도자료(CSR) | — |
| 컬리 | 0 | 기술 블로그 RSS | 없음 | — |
| 오늘의집 | 0 | 기술 블로그(SSR) | 없음 | — |
| 업스테이지 | 10 | `/events`(SSR), MABC 2026(SSR) | 없음 | Luma 2건 |

### 국내 게임사

| 주최 | 행사 | 읽을 수 있는 공지 위치 | 막힘 | 모음 사이트 |
| --- | --- | --- | --- | --- |
| 넥슨 | 6 | 넥슨 블로그(숨은 API), 메이플스토리 월드(내장 데이터) | NDC(CSR), 회사 소식(CSR). 사전 공지는 보도자료·LinkedIn | 씽유·링커리어 등에 공모전 일부 |
| 엔씨소프트 | 2 (NC AI) | 보도자료(SSR), NC Research Atom | NC AI 사이트 미확인 | 공모전·해커톤 일부 |
| 넷마블 | 1 (개발자 대상 0) | 보도자료(숨은 API) | 네이버 블로그(robots 금지) | — |
| 크래프톤 | 4 | krafton.ai RSS·프로그램(SSR), 크래프톤 블로그 RSS(2025-02 이후 멈춤) | 회사 사이트(CloudFront 403) | 공모전·해커톤 일부 |
| 스마일게이트 | 4 | 뉴스룸 보도자료 RSS, 퓨처랩 프로그램(숨은 API) | 없음 | 공모전·해커톤 일부 |

### 해외 빅테크·AI 회사

국내 개최와 한국에서 직접 참가할 수 있는 온라인 행사만 셌다. 해외 현장 행사와 생중계 시청은 세지 않았다.

| 주최 | 행사 | 읽을 수 있는 공지 위치 | 막힘·약관 | 모음 사이트 |
| --- | --- | --- | --- | --- |
| AWS | 4 | 한국 블로그 events 카테고리 RSS, 행사별 페이지(SSR) | Startups 행사(CSR). 약관이 봇 금지 | 이벤터스(Games on AWS 2026, 대행사 채널) |
| Google | 3 (날짜 미확인 9) | 한국 블로그 RSS, developers.google.com/events·cloud.google.com/events(SSR) | Cloud OnAir(CSR), Kaggle(CSR) | — |
| Microsoft | 3 | 한국 뉴스 RSS(Crawl-delay 10), Imagine Cup(SSR) | AI Tour(CSR) | — |
| Apple | 1 (Swift Student Challenge) | Developer 뉴스 RSS, 한국 이벤트 허브(SSR) | 전체 일정(CSR). 약관이 봇 금지 | — |
| Meta | 0 | 공식 행사 목록 없음 | 한국 뉴스 RSS 리다이렉트 실패. robots 주석으로 금지 | — |
| NVIDIA | 1 (AI Day Seoul) | AI Day 페이지(SSR), 한국 블로그 RSS | 행사 캘린더(CSR). 약관이 봇 금지 | PyTorch 한국 포럼(AI Day) |
| OpenAI | 1 (파트너 공동 서울 해커톤) | 뉴스 RSS, OpenAI Academy 이벤트(SSR) | `/events`·약관(Cloudflare 403) | — |
| Anthropic | 1 (파트너 공동 서울 해커톤, 날짜 미확인) | `/events`(SSR), claude.com/community(SSR·내장 데이터) | 약관이 봇 금지 | Luma |
| Cursor | 4 (커뮤니티 앰배서더 주최) | cursor.com/community(SSR·내장 데이터), 포럼 Asia 이벤트(SSR) | 약관이 봇 금지 | Luma |
| GitHub | 1 (Game Off, 온라인) | 이벤트 목록(SSR) | 국내 행사 0 | — |
| Databricks | 2 | World Tour·AI Days 페이지(SSR) | "다가오는 이벤트" 캘린더(CSR). 약관이 봇 금지 | — |
| Snowflake | 2 | 한국 이벤트 목록(SSR), World Tour 서울(SSR) | 약관이 봇 금지 | — |
| Hugging Face | 0 | 블로그 RSS, competitions(SSR) | 공식 행사 목록 없음 | — |

### 개발 동아리

기수 모집은 행사로 세지 않고 따로 적었다. 넣기로 했다([NAMED_ORGS.md](NAMED_ORGS.md) "결정" 절).

| 주최 | 행사 (외부 공개) | 기수 모집 | 읽을 수 있는 공지 위치 | 막힘 | 모음 사이트 |
| --- | --- | --- | --- | --- | --- |
| 멋쟁이사자처럼 | 0 확인 | 연 1회 | 공식 사이트(SSR, 행사 목록 없음) | 커뮤니티(robots 전체 금지) | — |
| SOPT | 0 확인 | 미확인 | 없음 | 공식 사이트(CSR) | — |
| YAPP | 0 확인 | 2건 | 모집 페이지(SSR), Medium RSS(2025-09 이후 행사 글 없음) | 없음 | — |
| 디프만 | 4 (1) | 1건 | 모집 페이지·블로그(SSR), Medium RSS | 없음 | — |
| 넥스터즈 | 3 (0) | 1건 | 모집 페이지(SSR) | 없음 | — |
| DND | 0 확인 | 연 2회(6월·12월) | 공식 사이트(SSR) | 없음 | — |
| UMC | 1 (외부 공개 추정) | 학교별 | 공식 사이트(SSR, 정적 문구) | 모집 페이지(CSR) | 이벤터스(9기 데모데이) |
| GDG on Campus | 표본 2개 챕터 5 (전체 15건 초과 추정) | 챕터별 연 1회 | gdg.community.dev 챕터 페이지(내장 데이터) | 없음 | — |
| CEOS | 0 확인 | 1건 | 없음 | 도메인 DNS 실패 | — |
| 큐시즘 | 2 (미확인) | 연 2회 | 아카이브·모집 페이지(SSR) | 네이버 블로그 RSS(robots 전체 금지) | — |

### 개발자 커뮤니티

| 주최 | 행사 | 읽을 수 있는 공지 위치 | 막힘 | 모음 사이트 |
| --- | --- | --- | --- | --- |
| AWSKRUG | 약 80~100 (추정) | Meetup 그룹(내장 데이터, 첫 화면만) | 다음 쪽 경로(robots 금지) | ticketa 없음 |
| GDG Korea | 약 21 (본 8개 챕터) | gdg.community.dev(내장 데이터, Crawl-delay 2) | 다음 쪽 경로(robots 금지) | ticketa(인천·Android·부산·대전·판교·Golang). GDG 서울은 없음 |
| PyCon Korea | 1 | 블로그 Atom | 행사 사이트(CSR) | ticketa 없음 |
| FEConf | 1 | 행사 사이트(SSR) | 없음 | ticketa |
| 드로이드나이츠 | 0 (2026-11-02 예정) | 행사 사이트(SSR) | 없음 | ticketa |
| let'swift | 3 | 행사 사이트(SSR·`.ics`) | 없음 | ticketa |
| GopherCon Korea | 3 | GDG Golang 챕터(내장 데이터) | 행사 사이트(CSR) | ticketa |
| Spring Camp | 1 | 공식 사이트 없음 | — | ticketa |
| JSConf Korea | 0 | 2022 아카이브 | — | — |
| 인프런(인프콘) | 0 | 2024 페이지 | — | — |
| Kotlin User Group Korea | 0 확인 (주최 미상 Kotlin 행사 2) | Medium RSS | 공식 채널 2017·2025-02 이후 멈춤, Meetup 그룹 없음 | — |
| PyTorch KR / TensorFlow KR | PyTorch KR 5, TF KR 미확인 | PyTorch KR 포럼 공지·홍보(SSR), 포럼 RSS | TF KR(robots 전체 금지, TLS 실패) | ticketa 없음 |

### 대회·해커톤 브랜드

| 주최 | 행사 | 읽을 수 있는 공지 위치 | 막힘 | 모음 사이트 |
| --- | --- | --- | --- | --- |
| ICPC 서울 리저널 | 2 | 공식 RSS, 사이트(SSR) | 없음 | 링커리어 |
| UCPC | 2 (대회·세미나) | ucpc.me·연도 사이트·세미나 사이트(SSR) | 없음 | 씽유 |
| Codegate | 1 | CTFtime API·RSS | 공식 사이트(403) | CTFtime |
| 빅콘테스트 | 1 | 공식 사이트(SSR) | 없음 | — |
| Junction | 1 | 없음 | 사이트 3곳 모두 CSR | — |
| 구름톤 | 1 확인 (다른 기수 미확인) | 공식 사이트(SSR) | 없음 | — |
| NASA Space Apps | 0 (2026-11 예정) | 공식 사이트(SSR) | 없음 | — |
| CCE | 1 | 없음 | 공식 사이트(CSR) | 링커리어 |
| 핵테온 세종 | 2 | 공식 사이트(SSR) | 없음 | — |
| POC | 3 (해킹캠프 2 애매) | POC·Zer0Con·해킹캠프 사이트(SSR) | 없음 | — |
| 화이트햇 콘테스트 | 미확인 | 없음 | 공식 사이트(TLS 실패) | 콘테스트코리아 등 |

### 공공기관

| 주최 | 행사 | 읽을 수 있는 공지 위치 | 막힘 | 모음 사이트 |
| --- | --- | --- | --- | --- |
| NIPA | 1 | 오픈소스 포털(운영 소스), NIPA 공지(SSR) | 없음 | — |
| NIA | 1 (역할 미확인 5) | NIA 공지·AI Hub 공지(SSR) | 없음 | — |
| KISA | 0 확인 (후원 1) | 보호나라 공지(SSR) | kisa.or.kr(403) | — |
| IITP | 미확인 (후원 1) | 없음 | robots 전체 금지 | — |

### 교육 프로그램

2026-10-25에 따로 조사했다([education](named-orgs-survey/education.md)). 모음 사이트 칸은 재조사 표본과 대조 중 나온 것까지 적었다.

| 주최 | 행사 | 읽을 수 있는 공지 위치 | 막힘 | 모음 사이트 |
| --- | --- | --- | --- | --- |
| SSAFY | 6 (교육생 전용 2) | 공지 게시판·SSAFY 소식(SSR) | 삼성전자 뉴스룸(응답 없음) | 이벤터스(`ssafy` 채널의 SSAFYnity 커리어 파티), 링커리어(다른 기수만, 검색 근거) |
| 우아한테크코스 | 1 (회원 전용) | 뉴스레터(maily.so), 기술 블로그 RSS | 공식 사이트(CSR, `/api/` robots 금지) | — |
| 네이버 부스트캠프 | 0 (2026 운영 안 함) | 메인 팝업 | 네이버 블로그 RSS(robots 전체 금지) | — |
| 카카오테크 캠퍼스 | 4 (교육생 전용 1) | 캠퍼스 뉴스(AJAX 조각), 카카오 보도자료 | 없음 | — |
| 크래프톤 정글 | 4 | 모집 일정·공지 목록(SSR) | 공지 상세 본문(CSR) | 이벤터스(설명회, 대행사 채널), 링커리어(12기 모집, 검색 근거) |
| 42서울 | 0 (찾지 못함) | 없음 | 도메인이 42 Network 홈으로 301 | — |
| 소프트웨어 마에스트로 | 3 | 모집 공고 페이지(SSR) | 네이버 블로그 RSS(robots 전체 금지) | 이벤터스(부산 설명회·모집, 발대식, PRE-SOMA), 씽유(검색 근거) |
| Apple Developer Academy | 11 | 이벤트 페이지·사이트맵(SSR) | 없음 | 이벤터스(SHOWCASE25), ticketa(로드쇼 4건 등), 씽유·링커리어(검색 근거) |

## 판단이 필요한 항목

조사 중 "결정" 절 규칙만으로 넣을지 정하기 어려웠던 것이다. 화살표 뒤는 그 뒤 정한 결과다([NAMED_ORGS.md](NAMED_ORGS.md) "결정"·"추가 결정" 절).

- 카카오 "AI 돛 Summit": 인재 양성 프로그램이 연 행사일 수 있다(교육 프로그램 행사는 제외 규칙). → 받는다(2026-10-25). 주최는 카카오이고, 카카오 AI 돛은 교육 과정이 아닌 협력 기구다. 행사는 무료 신청 컨퍼런스였고 이벤터스에 신청 페이지가 있었다. 근거는 [계획서](../IMPLEMENTATION_PLAN.md) 16장
- 카카오 증권사 대상 고객 세미나: 개발자 행사인지 애매하다. → 뺀다(2026-10-25, 개발 관련만) → 같은 날 개발 여부를 가리지 않기로 해서 받는다
- LINE Tech-Verse 2026(2026-06-29 온라인): 일본 LY Corporation 주최 시청형이라 뺐다. 한국어 페이지와 LINE Plus 발표자가 있다.
- 크래프톤 해커톤 3건: 채용 혜택이 붙는다(채용설명회는 제외 규칙). → 받는다(2026-10-23)
- 스마일게이트 비버롹스 2025(축제), 전시팀 모집, 프로토타이핑 챌린지: 행사 종류가 애매하다. → 비버롹스·전시팀 모집은 받는다(2026-10-25). 프로토타이핑 챌린지는 공모전이 아니라 선발형 멘토링이다. 교육 과정도 받기로 해서 받는다(2026-10-25)
- 넥슨게임즈 디지털아트 공모전: 개발이 아닌 아트 공모전이다. → 뺀다(2026-10-25) → 같은 날 개발 여부를 가리지 않기로 해서 받는다
- POC 해킹캠프 2회: 교육으로 볼지 애매하다. → 받는다(2026-10-25)
- 사내·초청 전용 행사: LG AI 데브콘, SKT AX 챌린지, SK AI 솔루션 리그, 현대차 24H 코드 레이스, KT Agent Camp 등. 보도자료 제목만으로는 사내 행사와 공개 행사를 구분할 수 없다. → 제목으로 모르면 일단 보낸다(2026-10-25)
- 동아리 기수 모집: 행사로 세지 않았다. 넣을지 정하지 않았다. → 받는다(2026-10-23)

## 묶음별 요약

### 국내 대기업 ([corp-a](named-orgs-survey/corp-a.md), [corp-b](named-orgs-survey/corp-b.md))

- 공개 행사는 고객 대상 컨퍼런스·웨비나가 중심이다. 개발자 해커톤·공모전은 드물다.
- 대형 컨퍼런스(REAL Summit, SK AI Summit, LG SPARK)는 자체 사이트와 보도자료로만 공지된다.
- 사내·초청 전용 행사가 많다.
- 그룹 뉴스룸 RSS는 보도자료 전체라 행사 글이 드물고, 대부분 행사가 끝난 뒤 나온다.

### 국내 IT 플랫폼·게임사 ([platform-a](named-orgs-survey/platform-a.md), [platform-b-game](named-orgs-survey/platform-b-game.md))

- 기간 안 행사는 연 1회 대형 컨퍼런스 위주다(DAN25, if(kakao)26, WOOWACON 2026).
- DAN26은 열리지 않는다(검색 근거: 딜사이트 2026-10-20). 우아한테크세미나는 2024-12 이후 기술 블로그 기록이 없다.
- 플랫폼 7곳(네이버~LINE)은 모두 봇이 읽을 수 있는 RSS나 SSR 공지 위치가 있다.
- 0건: 토스, 쿠팡, 당근, LINE, 컬리, 오늘의집, 야놀자.
- 게임사 공모전·해커톤은 씽유·링커리어·더팀스·슈퍼루키에 일부 올라온다. 컨퍼런스·세미나(NDC, MUSINSA PATTERN)는 모음 사이트 등장을 확인하지 못했다.

### 해외 빅테크·AI ([global](named-orgs-survey/global.md))

- 국내 행사가 꾸준한 곳: AWS(Summit 5월, Games on AWS 10월), Google, Microsoft(AI Tour Seoul 3월), NVIDIA(AI Day Seoul 11월), Snowflake(World Tour 서울 8월), Databricks(AI Days 서울 4월).
- 7곳(AWS, Apple, NVIDIA, Databricks, Snowflake, Anthropic, Cursor)이 약관으로 봇·스크래핑을 금지한다.
- Cursor·Anthropic 서울 행사는 Luma에 올라온다.

### 개발 동아리 ([clubs](named-orgs-survey/clubs.md))

- 외부 공개가 확인된 행사는 디프만 18기 런칭데이(2026-06-20) 1건이다.
- 대부분 인스타그램·카카오톡 채널로 공지한다. RSS가 있는 곳은 디프만·YAPP(Medium)뿐이다.
- 기수 일정을 공식 모집 페이지에 날짜와 함께 올리는 곳은 YAPP·디프만·넥스터즈다.

### 개발자 커뮤니티 ([community](named-orgs-survey/community.md))

- AWSKRUG(연 80~100건 추정)와 GDG Korea(본 챕터만 약 21건)가 압도적으로 많다. 둘 다 첫 화면만 읽을 수 있다.
- 컨퍼런스형 커뮤니티 행사(FEConf, 드로이드나이츠, let'swift, GopherCon, 스프링캠프, GDG 지방 챕터)는 ticketa에 올라온다.
- PyCon Korea, PyTorch KR, AWSKRUG 소모임, GDG 서울은 ticketa에 없다.
- 활동이 멈춘 곳: JSConf Korea(2022 이후), 인프콘(2025 휴식), Kotlin User Group Korea.

### 대회 브랜드·공공기관 ([contest-public](named-orgs-survey/contest-public.md))

- 대회 브랜드는 대부분 연 1회다. 단일 행사 사이트는 대부분 SSR이다. 공식 RSS는 ICPC뿐이다.
- 공공기관은 행사 공지가 운영 공지에 섞인다. NIA는 공지 2.5개월분에서 행사 5건이 나왔다.
- KISA·IITP는 직접 확인한 행사가 0건이고 핵테온 후원 명단에만 있다.

### 교육 프로그램 ([education](named-orgs-survey/education.md))

- 기간 안 공개 행사는 모집 공고와 설명회가 대부분이다. 해커톤·발표회는 대부분 교육생 전용이다.
- 우테코 9기와 42서울 행사는 찾지 못했다. 부스트캠프는 2026년에 운영하지 않는다.
- 재조사 표본 7건 중 4건이 이벤터스(3)·링커리어(1)에 있었다. 2건은 다른 기수 공고만 있었다.
