# corp-a 조사 결과 (삼성·LG·현대자동차그룹·SK)

조사일: 2026-10-23(한국 시간). 기간: 2025-11-01 ~ 2026-10-31.
원본 파일: `scratchpad/survey/raw/corp-a/`.
제약: 세션 공용 WebSearch 한도가 조사 도중 여러 번 바닥났다. 그래서 검색하지 못한 계열사가 있다. 각 주최의 "메모"에 적었다.
직접 요청 수: 삼성 12회(시간 초과 2 포함), LG 14회(DNS 실패 1, 스크립트 2 포함), 현대자동차그룹 11회(DNS 실패 2 포함), SK 8회. 계열사가 여러 곳이라 "주최당 약 10회"를 넘긴 곳이 있다.

## 삼성
- 조사 범위: 삼성전자(삼성리서치·Samsung Developers 포함), 삼성SDS. 삼성종합기술원은 SCPC AI 챌린지만 검색했다. 삼성전기·삼성SDI는 보지 않았다.
- 공지 위치:
  - 이벤트 목록 페이지 `https://developer.samsung.com/events/ko?year=2025` — 읽기: SSR / robots: 허용(`/feed`·`/login`·`/partner`·`/dashboard`만 금지) / 연도별 목록이다. 카드에 제목, 상태(FINISHED), 종류(conference), 한 줄 요약, "Online"이 있다. 2025년 2건(SAIF 2025, STC 2025), 2026년 1건(SAIF 2026). SCPC는 이 목록에 없다
  - 공식 행사 사이트 `https://research.samsung.com/saif` — 읽기: SSR / robots: 허용(`/css/`·`/js/` 등 자원만 금지) / 본문에 "Samsung AI Forum 2026", "September 30, 2026"이 있다
  - 공식 행사 사이트 `https://research.samsung.com/scpc` — EVENT_SITES 기준 SSR
  - 이벤트 목록 페이지 `https://research.samsung.com/gallery` — 읽기: SSR / robots: 허용 / 지난 행사 사진첩이다. SAIF 2025(2025-09-16), SCPC 2025, SSTF 2024까지 있다. SSTF 2025는 없다
  - 이벤트 목록 페이지 `https://www.samsungsds.com/kr/event/index.html` — 읽기: 숨은 API, 단 robots 금지 / robots: 페이지는 허용 / 원본 HTML에는 상단 배너 1건만 있다. 목록은 `<input id="dataUrl" value="/kr/event/data.txt">`에서 받는다. robots에 `Disallow: /*.txt`가 있어 요청하지 않았다
  - 공식 행사 사이트 `realsummit2026.com`(REAL Summit 2026), `stckorea.com`(STC 2025) — 검색 근거. 요청하지 않았다
  - 뉴스룸 `https://news.samsung.com/kr` — 읽기: 불가 / robots: 미확인 / `robots.txt`가 2회 모두 20초 시간 초과였다. 태그별 RSS(`news.samsung.com/kr/tag/{태그}/feed`)는 있다(검색 근거)
  - 모음 사이트 `https://event-us.kr/saif2026/event/135379` — SAIF 2026 등록 페이지(검색 근거). 요청하지 않았다
  - SNS: YouTube(SAIF 2026 생중계, 검색 근거). URL은 확인하지 못했다
- 약관:
  - Samsung Developers(`https://developer.samsung.com/terms`, `?location=us`로 연결): 이용자 대상 금지. "Use any robot, spider, script, or any manual or automated application or means to extract, download, retrieve, index, mine, scrape, reproduce … any feature, function, or part of the Site"
  - 삼성리서치: SOURCE_CANDIDATES 기준. 자동 수집 조항은 없다. 개인·비상업 이용 문구만 있다
  - 삼성SDS: 미확인(약관을 요청하지 않았다)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 5건, 후원 발견 1건
  - Samsung Tech Conference 2025(STC 2025) — 2025-11-20 — 컨퍼런스 — 온라인 — 주최(삼성전자) — 모음 사이트: 찾지 못함(전용 등록 사이트 stckorea.com) — 근거: `https://developer.samsung.com/events/ko?year=2025`, 검색 근거
  - 제12회 SCPC(알고리즘·AI 챌린지) — 접수 6월~7월 초, 본선 2026-08-21(AI)·08-28(알고리즘) — 공모전(대회) — 국내(예선 온라인) — 주최(삼성전자, 삼성리서치 운영) — 모음 사이트: DACON(AI 챌린지 접수, 검색 근거), 링커리어 커뮤니티 뉴스 묶음글(검색 근거). 링커리어 공모전 목록 등록은 미확인 — 근거: EVENT_SITES 기준, 검색 근거
  - REAL Summit 2026 — 2026-09-08 — 컨퍼런스(기업 AX) — 국내(코엑스)·온라인 — 주최(삼성SDS) — 모음 사이트: 미확인 — 근거: 검색 근거(`https://www.samsungsds.com/kr/news/sds20260908.html`)
  - Samsung AI Forum 2026(SAIF 2026) — 2026-09-30 — 포럼(컨퍼런스) — 국내(서초사옥, 현장은 초청제)·YouTube 생중계 — 주최(삼성전자) — 모음 사이트: event-us(검색 근거) — 근거: `https://research.samsung.com/saif`, `https://developer.samsung.com/events/ko?year=2026`
  - 삼성SDS 웨비나 "2026 물류 메가트렌드 및 AI 혁신 전망" — 게시 기간 2026-05-27~2027-05-26 — 웨비나(다시보기형) — 온라인 — 주최(삼성SDS) — 모음 사이트: 미확인 — 근거: `https://www.samsungsds.com/kr/event/index.html`. B2B 물류 주제다
  - AWS Summit Seoul 2026 — 2026-05-20~21 — 컨퍼런스 — 국내 — 후원·참가(삼성SDS 세션·부스) — 모음 사이트: 미확인 — 근거: 검색 근거(`https://www.samsungsds.com/kr/event/awssummitseoul-2026-0520.html`)
- 예정(2026-11 이후): 없음. Samsung Developers 2026 목록에 2026-11 이후 행사가 없다(2026-10-23 기준)
- 메모:
  - 기간 밖: SAIF 2025(2025-09-15~16), REAL Summit 2025(2025-09-11)
  - SSTF(삼성보안기술포럼): 마지막 확인 회차는 2024-09-10이다. 2025·2026 회차 근거를 찾지 못했다(사진첩에도 없다)
  - SDC는 미국 현장 행사라 세지 않는다. 2025년에는 SDC 대신 STC를 열었다(검색 근거). SDC Korea·SOSCON 주소 소멸은 EVENT_SITES 기준
  - 뺀 것: CES 2026 삼성 기술 포럼(해외 현장), 삼성SDS 알고리즘 특강(교육)
  - 삼성SDS의 다른 웨비나·세미나 수는 미확인이다. 목록 데이터가 robots 금지 경로에 있다
  - 연간 주기: SCPC 6~8월, REAL Summit 9월, SAIF 9월, STC 11월(2025 1회)

## LG
- 조사 범위: LG AI연구원, LG CNS, LG전자, LG유플러스(robots만). LG그룹 보도자료는 검색으로만 봤다.
- 공지 위치:
  - 기술 블로그·뉴스 `https://www.lgresearch.ai/news` — 읽기: CSR / robots: 허용 / Nuxt 페이지다. 원본 HTML과 `__NUXT__`에 목록이 없다. 앱 스크립트는 `/api/...`를 부른다. 목록 엔드포인트는 찾지 못했다. 사이트맵에 `/news/view?seq=` 326건이 있다(제목 없음)
  - 이벤트 목록 페이지 `https://www.lgcns.com/kr/moa/event` — 읽기: 숨은 API, 단 robots 금지 / robots: 페이지는 허용 / 원본 HTML은 빈 카드 틀뿐이다. 목록은 `fetch("/bin/tfi/eventsList?…")`로 받는다. robots `Disallow: /bin/`라 요청하지 않았다. 탭은 "진행중인 행사", "종료된 행사"다
  - LG그룹 보도자료 `https://www.lg.co.kr/media/release/{번호}` — 검색 근거. 요청하지 않았다
  - LG전자 뉴스룸: `www.lgnewsroom.com`은 `lgnewsroom.com`으로 연결된다. 그 RSS는 항목이 0개이고 `<language>vi</language>`, 마지막 갱신 2026-09-17이다. `live.lge.co.kr`은 DNS가 없다. LG전자 국내 뉴스룸은 `www.lge.co.kr/story/newsroom/…`(검색 근거, 미요청)
  - LG유플러스 `https://www.lguplus.com` — robots: `User-agent: *` 그룹이 없다(검색엔진·AI 봇 이름별 규칙만 있다). 행사 공지 위치는 미확인
- 약관:
  - LG AI연구원(`https://www.lgresearch.ai/policies`, 저작권 정책): 재배포 금지. "무단 복제 및 배포를 원칙적으로 금합니다. 다만, … 링크하는 것은 허용되며, 이 경우에도 출처는 반드시 명기하여야 합니다." 자동 수집 조항은 이메일 무단수집 거부뿐이다
  - LG CNS: 사이트맵에 이용약관이 없다(개인정보 동의문만 있다). 하단에 이메일 무단수집 거부 문구가 있다. 자동 수집 조항은 미확인
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 4건(외부 참가 확인 1건), 후원 발견 1건
  - LG SPARK 2026 — 2026-09-07~17 — 기술 축제(테크페어·AX페어·AI 토크콘서트·데브콘) — 국내(LG사이언스파크) — 주최(LG) — 일반인 프로그램(EXAONE Drawing Challenge, AI 단편영화제)이 있다 — 모음 사이트: 미확인 — 근거: 검색 근거(Korea Times 2026-09-04, `https://www.lg.co.kr/media/release/30537`)
  - LG AI 데브콘 2026 — 2026-09-15~16 — 개발자 컨퍼런스 — 국내·온라인 — 주최(LG전자 SW센터), 주관(LG SW협의회) — 참가자는 LG 계열사 개발자 약 1,500명으로 보도됐다. 외부 공개 여부 미확인 — 모음 사이트: 미확인 — 근거: 검색 근거(머니투데이 2026-09-16)
  - LG Prompt-on Challenge 2026 — 2026-09(데브콘 기간) — 해커톤(EXAONE 활용, 결선 10팀) — 국내 — 주최(LG) — 참가 대상 미확인 — 모음 사이트: 미확인 — 근거: 검색 근거
  - LG AI Insight 2026 — 날짜 미확인 — 세미나·포스터 세션 — 국내 — 주최(LG AI연구원) — 모음 사이트: 미확인 — 근거: 검색 근거(`https://www.lgresearch.ai/news/view?seq=635`)
  - 2026 FIRST Global Challenge — 2026-10-07~10 — 청소년 로봇 대회 — 국내(송도컨벤시아) — 후원(LG CNS 공식 후원) — 모음 사이트: 미확인 — 근거: 검색 근거
- 예정(2026-11 이후): 미확인
- 메모:
  - LG 행사는 9월 LG SPARK에 몰려 있다. LG SPARK 2025도 2025-09에 열렸다(기간 밖)
  - LG AI 데브콘은 2022년부터 연 "LG 소프트웨어 개발자 콘퍼런스"의 새 이름이다(검색 근거). 사내 행사일 수 있다
  - 뺀 것: LG Aimers와 그 해커톤(교육 프로그램)
  - 검색 한도 때문에 LG유플러스 행사와 LG CNS 자체 행사는 검색하지 못했다. LG CNS 자체 개발자 행사는 첫 검색에서 2026년 것을 찾지 못했다(2014 해커톤, 2016 코드몬스터만)

## 현대자동차그룹
- 조사 범위: 현대자동차·기아(그룹 사이트, Pleos), 42dot, 현대오토에버(robots만), Softeer(DNS만).
- 공지 위치:
  - 공식 행사 사이트 `https://devcon.hyundaimotorgroup.com` — 301로 `https://pleos.ai/pleos25/`에 간다. 읽기: SSR / robots: 없음(`devcon…/robots.txt`도 Pleos 25 HTML로 연결, `pleos.ai/robots.txt`는 404) / "Pleos 25 - 현대자동차그룹 개발자 컨퍼런스", "2025.03.28 (Fri.) COEX". 2021~2023 HMG Developer Conference 링크가 있다
  - 공식 행사 사이트 `https://pleos.ai/playground` — 읽기: CSR / robots: 없음 / Next.js다. 원본 HTML에 공모전·행사 공지가 없다. og 메타는 아직 "Pleos 25"다
  - 그룹 뉴스룸 `https://www.hyundaimotorgroup.com/ko/news/…` — robots: 허용(`searchContents=`, `listYn=N`, `/amp/`만 금지) / 목록 페이지는 요청하지 않았다. 한국어 사이트맵은 22건뿐이고 기사 URL이 없다
  - 기술 블로그 `https://42dot.ai/ko/stories/blog-news` — robots: 허용(`/api/` 금지) / 사이트맵 기준 기간 안 행사 글이 없다. 읽기 방식은 미확인(사이트맵만 읽었다)
  - Softeer: `softeer.ai`는 DNS 응답이 없고 `www.softeer.ai`는 NXDOMAIN이다. `developers.hyundaimotorgroup.com`도 NXDOMAIN이다
  - 현대오토에버 `https://www.hyundai-autoever.com` — robots: 허용(파일 다운로드 경로만 금지) / 행사 공지 위치 미확인
  - 모음 사이트: superookie(Pleos Playground 앱 공모전), innoforest(기아 PBV 아이디어 공모전), 링커리어 `https://linkareer.com/activity/358198`(앱 개발 챌린지 일정) — 모두 검색 근거
- 약관: 현대자동차그룹 서비스 이용약관 `https://www.hyundaimotorgroup.com/ko/footer/terms` — 원본 HTML에 약관 본문이 없다(제목과 뉴스레터 동의문만). 미확인. Pleos·42dot 약관은 미확인
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건(연도 미확인 1건 별도), 후원 발견 0건
  - Pleos Playground 앱 공모전 — 접수 ~11-15, 온라인 설명회 10-28, 1차 결과 11-23, 최종 PT 12-03~04 — 공모전(차량용 앱 개발) — 국내 — 주최(현대차·기아) — 대상: 대학생·SW 개발자·스타트업, 총상금 5,100만 원 — 모음 사이트: superookie, 링커리어(같은 공모전인지는 미확인) — 근거: 검색 근거
  - 제5회 기아 PBV 아이디어 공모전 — 접수 08-18~10-31, 결과 11-16(연도 미확인) — 아이디어 공모전 — 국내 — 주최(기아) — Pleos Playground 샘플 지원 — 모음 사이트: innoforest — 근거: 검색 근거. 연도를 확인하지 못해 건수에 넣지 않았다
- 예정(2026-11 이후): Pleos Playground 앱 공모전 최종 PT 2026-12-03~04, 결과 2026-12-18, 그룹 행사 전시·시상 2027-02(링커리어 공고, 검색 근거)
- 메모:
  - HMG 개발자 컨퍼런스: 2021-11(온라인), 2022-11, 2023-11-13(코엑스). 2025-03-28 Pleos 25로 이름을 바꿨다. Pleos 26 근거는 없다
  - 기간 밖: 2025 자율주행 챌린지(결선 2025-09-30). 2026 회차는 찾지 못했다
  - 뺀 것: HMG Tech Talent Forum 2026(2026-09-17~18 미국 산호세 현장, 채용 연계), 24H 코드 레이스 해커톤(임직원 대상, 2026-08 보도), Pleos Challenge by H-Stylist 2026(소비자 투표 이벤트)
  - 검색 한도 때문에 42dot·현대오토에버·Softeer 행사는 검색하지 못했다

## SK
- 조사 범위: SK그룹(SK AI Summit), SK텔레콤, SK하이닉스, SK AX, DEVOCEAN(SK 개발자 커뮤니티). SK플래닛은 보지 않았다.
- 공지 위치:
  - 공식 행사 사이트 `https://www.skaisummit.com` — EVENT_SITES 기준 시간 초과. 다시 요청하지 않았다
  - 기술 블로그·커뮤니티 `https://devocean.sk.com` — 읽기: 불가 / robots: 금지(`User-agent: *` `Disallow: /`. Googlebot·Yeti·Daumoa와 이름 붙은 AI 크롤러만 허용) / robots 외에는 요청하지 않았다
  - 기술 블로그 RSS(뉴스룸) `https://news.sktelecom.com/feed` — 읽기: 공식 API·RSS / robots: 허용 / 30건이 약 2주치(2026-10-07~10-22)다. 같은 글이 두 번씩 나온다
  - 기술 블로그 RSS(뉴스룸) `https://news.skhynix.co.kr/feed/` — 읽기: 공식 API·RSS / robots: 허용 / 10건이 하루치(2026-10-22)다. 같은 글이 여러 번 나온다
  - 이벤트 목록 페이지 `https://www.skax.co.kr/insight/events` — 읽기: CSR / robots: 허용 / Next.js다. 원본 HTML과 `self.__next_f` 내장 데이터에 필터 탭("전체·웨비나·프로모션")만 있고 목록은 없다. API 주소도 찾지 못했다
- 약관: SKT 뉴스룸·SK하이닉스 뉴스룸·SK AX 모두 미확인(요청하지 않았다). DEVOCEAN은 robots 금지라 약관도 요청하지 않았다
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 4건, 후원 발견 0건
  - SK하이닉스 AI 해커톤 2026 — 접수 2026-09-21~28, 온라인 예선, 본선 2026-11-11(코엑스) — 해커톤 — 국내 — 주최(SK하이닉스) — 학력·전공 제한 없음, 총상금 1억 원, 우수자 채용 패스트트랙 — 모음 사이트: 찾지 못함(링커리어·씽유·위비티·요즘것들 이름으로 검색, 검색 근거) — 근거: 검색 근거(`https://news.skhynix.co.kr/?p=66696`, 이코노미스트 2026-09-21)
  - SK AI Summit 2025 — 2025-11-03~04 — 컨퍼런스 — 국내(코엑스)·온라인 — 주최(SK그룹) — 모음 사이트: 미확인 — 근거: EVENT_SITES 기준(검색 근거)
  - Claude Code Builder Hackathon — 2025-11(SK AI Summit 2025 부대행사) — 해커톤 — 국내 — 주최(SK, Anthropic 공동) — 본선은 심사로 약 100명 — 모음 사이트: 미확인 — 근거: 검색 근거. 정확한 날짜는 미확인
  - 행복 AI 챌린지 — 2026-10(10-15 개최 발표, 10-19 현장 기사) — AI 활용 대회(영상·포스터 제작, 협동 미션) — 국내 — 주최(SK텔레콤) — 장애 청소년 대상이다. 개발 행사 성격은 약하다 — 모음 사이트: 미확인 — 근거: `https://news.sktelecom.com/feed`
- 예정(2026-11 이후): SK하이닉스 AI 해커톤 2026 본선 2026-11-11(코엑스, 검색 근거). SK AI Summit 2026 근거 없음. SKT 뉴스룸 RSS(10-07~10-22)에 공지가 없고, 검색 결과도 2025 회차뿐이다. 2025 회차는 행사 약 3주 전에 처음 보도됐다(SOURCE_CANDIDATES 기준)
- 메모:
  - 뺀 것: SKT 사내 AI 해커톤 "AX 챌린지"(2026-05-19~21, 임직원), TECH4GOOD 해커톤 2026(SKT·하나금융그룹 공동, 참가자가 FLY AI 챌린저 등 교육 프로그램 출신, 2026-07 보도), 2026 SK AI 해커톤 "AI 솔루션 리그"(39개 계열사 271팀, 결선 2026-09-15 무렵, 계열사 대상으로 보도)
  - 검색 한도 때문에 SK AX·SK플래닛 행사는 검색하지 못했다. SK하이닉스는 해커톤 1건만 검색했다
  - DEVOCEAN은 SK 계열 개발자 커뮤니티다. 행사 공지가 있는지는 robots 금지로 확인하지 못했다

## 묶음 요약
- 행사 0건 주최는 없다. 현대자동차그룹은 기간 안에 확인된 것이 Pleos Playground 앱 공모전 1건뿐이다. 개발자 컨퍼런스는 2025-03 Pleos 25 이후 근거가 없다.
- 목록을 읽을 수 없는 곳: 삼성SDS 이벤트(`/kr/event/data.txt`, robots `/*.txt` 금지), LG CNS 행사(`/bin/tfi/eventsList`, robots `/bin/` 금지), DEVOCEAN(robots 전체 금지), 삼성 뉴스룸(시간 초과), Softeer(DNS 없음). CSR: LG AI연구원 뉴스, SK AX 이벤트, Pleos Playground.
- 바로 읽히는 곳: Samsung Developers 이벤트 목록(SSR, 연도별)과 삼성리서치 SAIF·SCPC·사진첩(SSR), SKT·SK하이닉스 뉴스룸 RSS. 다만 뉴스룸 RSS는 보도자료 전체라 행사 글이 드물다.
- 모음 사이트에는 거의 안 올라온다. 확인된 것은 SAIF 2026(event-us), SCPC AI 챌린지(DACON), Pleos·기아 공모전(superookie·innoforest·링커리어)뿐이다. 대형 컨퍼런스(REAL Summit, SK AI Summit, LG SPARK)는 자체 사이트·보도자료로만 공지된다.
- 검색에 걸린 그룹 해커톤·컨퍼런스 중 여럿이 사내 행사다(LG AI 데브콘, SKT AX 챌린지, SK AI 솔루션 리그, 현대차 24H 코드 레이스). 보도자료 제목만으로는 사내·공개가 구분되지 않는다.
