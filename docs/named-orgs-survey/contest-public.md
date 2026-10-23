# 대회·해커톤 브랜드 + 공공기관 (contest-public)

조사 날짜: 2026-10-23 (한국 시간). 대상 기간: 2025-11-01 ~ 2026-10-31.

공통 메모:

- 봇 UA로 curl만 썼다. 같은 호스트 간격은 1.2초다.
- WebSearch는 9회 쓴 뒤 세션 공용 한도(200회)가 다 찼다. 그래서 대부분 "모음 사이트 등장 여부"와 일부 과거 회차가 미확인이다. "미확인(검색 한도)"으로 표시했다.
- "EVENT_SITES 기준", "SOURCE_CANDIDATES 기준"은 그 문서의 2026-10-22~23 기록을 인용한 것이다.
- 원본 파일: `scratchpad/survey/raw/contest-public/`

## ICPC 서울 리저널
- 조사 범위: robots, 메인, RSS, `/history/` 직접 요청(4회). 검색 4회.
- 공지 위치:
  - 공식 사이트 `https://icpckorea.org` — 읽기: SSR / robots: 허용(`User-agent: *`만 있고 규칙 없음) / 메인에 일정(예비소집·예선·본선)과 공지 8건이 있다
  - RSS `https://icpckorea.org/feed` — 읽기: 공식 API·RSS / robots: 허용 / 10건, 2026-06-15~10-22. 공지가 모두 들어온다
  - 공식 사이트 `https://icpckorea.org/history/` — 읽기: SSR / robots: 허용 / 2001~2026 회차 링크 아카이브
  - 모음 사이트 `https://linkareer.com/activity/349550` — 2026 대회 공고(검색 근거)
- 약관: 찾지 못했다(SOURCE_CANDIDATES 기준).
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 2건, 후원 발견 0건
  - 2025 ICPC Seoul Regional(제25회 대학생 프로그래밍 경시대회) — 접수 2025.9.8~9.23(검색 근거), 본선 2025.11.22 부산 벡스코 — 대회 — 국내 — 주최 과기정통부·주관 NIA(뉴스서울 2025-11-23 기사, 검색 근거) — 모음 사이트: 공고 등록은 찾지 못했다. 콘테스트코리아 게시판 글 "2025 경시대회 공고 모음"에 접수 기간이 있다(검색 근거) — 근거: `https://newsseoul.co.kr/news/view/1065607810378107`
  - 2026 ICPC Seoul Regional(제26회) — 접수 2026.9.7~9.22, 예선 10.17 온라인(예비소집 10.16), 본선 11.13~14 KINTEX — 대회 — 국내 — 주최 과기정통부(링커리어 공고 기준) — 모음 사이트: 링커리어(검색 근거) — 근거: `https://icpckorea.org/` 메인, RSS
- 예정(2026-11 이후): 2026 본선 11.13~14 KINTEX.
- 메모:
  - 연 1회. 6월 일정 공지 → 9월 등록 → 10월 예선 → 11월 본선.
  - 2023·2024 회차 공고는 링커리어·올포영·위비티·콘테스트코리아에 있었다(검색 근거). 2025 회차는 1회 검색에서 찾지 못했다.
  - RSS에 "2026-2027 ICPC APAC Championship 경시 규칙 안내"(10-05)가 있다. 개최지는 확인하지 않았다.
  - 2025 본선 장소가 부산인데 사이트 아카이브 이름은 "2025 Seoul Regional"이다.

## UCPC
- 조사 범위: `ucpc.me` robots·메인, `2026.ucpc.me` robots·메인, `seminar.ucpc.me` robots·메인(6회). 검색 2회.
- 공지 위치:
  - 공식 사이트 `https://ucpc.me` — 읽기: SSR / robots: 허용(Cloudflare 주석만, 규칙 없음) / "(M/D) 내용" 공지 10건. 회차 사이트 링크 2019~2026, `2023w`
  - 공식 사이트 `https://2026.ucpc.me` — 읽기: SSR / robots: robots 없음(404) / 대회 안내·예선·본선 메뉴
  - 공식 사이트 `https://seminar.ucpc.me` — 읽기: SSR / robots: robots 없음(GitHub Pages 404) / 일시·장소·연사가 본문에 있다. `last-modified`, `etag` 있다. 아카이브 2017·2025·2026
  - SNS `https://www.facebook.com/groups/ucpc.korea`, `https://www.instagram.com/ucpc__official/`, Discord `https://discord.gg/8YdPsbAjqb`
  - 모음 사이트 `https://thinkyou.co.kr/contest/64113/` — 씽유, UCPC 2026(검색 근거)
- 약관: 찾지 못했다.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 2건, 후원 발견 0건
  - UCPC 2026 — 신청 6.5~6.22(연장), 예선 6.27 온라인, 본선 7.12 KAIST — 대회 — 국내 — 주최(전국 대학생 프로그래밍 대회 동아리 연합) — 모음 사이트: 씽유(검색 근거) — 근거: `https://ucpc.me/`
  - 2026 전대프연 세미나 — 신청 공지 6.24, 행사 7.13 KAIST 대강당 — 세미나 — 국내 — 주최 — 모음 사이트: 미확인(검색 한도) — 근거: `https://seminar.ucpc.me/`
- 예정(2026-11 이후): 없음(공지 없음).
- 메모:
  - 연 1회 여름 대회 + 다음 날 세미나. 세미나 사이트도 연도별 아카이브가 있다.
  - 2023 이후 겨울 대회 링크는 없다(`2023w`만).
  - 2026 후원사: Jane Street, HRT, 현대모비스, Citadel, Moloco, Asteromorph, 넥슨코리아, 스타트링크.

## Codegate
- 조사 범위: 직접 요청 없음(EVENT_SITES 기준 봇 UA 403, 재시도 안 함). 검색 2회.
- 공지 위치:
  - 공식 사이트 `https://www.codegate.org` — 읽기: 불가 / robots: 403으로 미확인 / EVENT_SITES 기준
  - 모음 사이트 CTFtime `https://ctftime.org` — 읽기: 공식 API·RSS / robots: `Crawl-delay: 10` / Codegate CTF 2026 예선이 올라왔다(SOURCE_CANDIDATES 기준, 검색 근거)
- 약관: 미확인.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - 코드게이트 2026 국제해킹방어대회 — 예선 2026.3.28 온라인(88개국 3,333명), 본선 7.23~24 서울 코엑스 — 대회(CTF) — 국내 본선·온라인 예선 — 주최 측 표기는 미확인("코드게이트보안포럼" 사무국 발표) — 모음 사이트: CTFtime(검색 근거). 국내 모음 사이트는 미확인(검색 한도) — 근거: `https://byline.network/2026/04/2-405/`, `https://mobile.newsis.com/view/NISX20260724_0003721624`(검색 근거)
- 예정(2026-11 이후): 미확인.
- 메모:
  - 접수 기간, 같이 여는 컨퍼런스 여부는 미확인이다.
  - 본선 시기(7월)로 보아 2025 회차는 기간 밖이다. 2025 날짜 자체는 확인하지 않았다.

## 빅콘테스트
- 조사 범위: robots, 메인(2회).
- 공지 위치:
  - 공식 사이트 `https://www.bigcontest.or.kr` — 읽기: SSR(단일 행사) / robots: 허용(`Allow: /`) / 6단계 일정, 분야, 공지가 본문에 있다. 주최·주관·후원은 로고 이미지뿐이다(과기정통부, KAIT, AIDATA FORUM, SK텔레콤, 신한카드)
  - SNS `https://www.youtube.com/@bigcontest`(SOURCE_CANDIDATES 기준)
  - 공지 게시판 NIA 공지에 "「2026 데이터+AI 혁신 챌린지」 통합 공고 안내"(2026-09-01)가 있다. 빅콘테스트 부제와 이름이 같다. 상세는 요청하지 않았다
- 약관: 없음(SOURCE_CANDIDATES 기준).
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건(+13회 미확인), 후원 발견 0건
  - 제14회 빅콘테스트(2026 데이터+AI 혁신 챌린지 통합 경진대회) — 시작 2026.9.8, 제출 마감 10.26, 서류심사 11.5~9, 발표심사 11.18~20, 수상자 발표 11.27, 시상식 12월(미정) — 공모전(AI·데이터) — 국내 — 주최 과기정통부·KAIT(SOURCE_CANDIDATES 기준) — 모음 사이트: 미확인(검색 한도) — 근거: `https://www.bigcontest.or.kr/`
  - 제13회(2025) — 날짜 미확인. 시상식이 2025-12라면 기간에 걸친다
- 예정(2026-11 이후): 14회 발표심사 11.18~20, 수상자 발표 11.27, 시상식 12월.
- 메모: 같은 주소를 해마다 덮어쓴다. 아카이브가 없어 13회 일정은 사이트에서 볼 수 없다.

## Junction (JunctionX Korea, Junction Asia)
- 조사 범위: `www.hackjunction.com` robots·메인, `hackjunction.app` robots·`/events`·`/terms`, `asia.hackjunction.com` robots(6회).
- 공지 위치:
  - 공식 사이트 `https://asia.hackjunction.com` — 읽기: CSR(단일 행사) / robots: robots 없음(S3 NoSuchKey 404) / 일정은 JS 번들에만 있다(SOURCE_CANDIDATES 기준)
  - 공식 사이트 `https://hackjunction.app/events` — 읽기: CSR / robots: robots 없음(404) / Next.js 셸. RSC 데이터에 행사 정보가 없다
  - 공식 사이트 `https://www.hackjunction.com` — 읽기: CSR / robots: robots.txt 자리에 HTML(규칙 0개) / Vite 셸 1,615바이트
  - SNS `https://instagram.com/junctionasia`
- 약관: 플랫폼 바닥글 링크 `https://hackjunction.app/terms`가 봇 UA에 404다. 약관 미확인.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - JunctionX Korea 2026 — 모집 7.8~7.26, 본행사 8.21~23 포항 — 해커톤 — 국내 — 주최 — 모음 사이트: 미확인(검색 한도) — 근거: SOURCE_CANDIDATES 기준(`asia.hackjunction.com` 번들)
- 예정(2026-11 이후): 공지 없음.
- 메모: 연 1회 8월. 행사 이름이 해마다 바뀐다(2025 "Junction Asia", 2026 "JunctionX Korea"). 2025 회차(8월)는 기간 밖이다.

## 구름톤
- 조사 범위: robots, 메인, `/collection`, sitemap, `/9oormthon-after-party`, 유니브 추정 주소 robots(6회).
- 공지 위치:
  - 공식 사이트 `https://9oormthon.goorm.io` — 읽기: SSR(Oopy) / robots: 허용(`Disallow: /_private/`만) / 모집 상태·기간이 본문에 있다. 강한 ETag
  - 공식 사이트 `https://9oormthon.goorm.io/collection` — 읽기: SSR / robots: 허용 / 결과물 이름만 있고 기수·날짜가 없다
  - 공식 사이트 `https://9oormthon.goorm.io/sitemap.xml` — 5개 URL. 공지는 `/notice/18th` 하나
  - `https://9oormthon.goorm.io/9oormthon-after-party` — 2023.2.25 애프터파티(기간 밖)
- 약관: `https://accounts.goorm.io/terms` 제20조 "회원은 … 영리목적으로 이용하거나 제3자에게 이용하게 할 수 없습니다."(SOURCE_CANDIDATES 기준)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건 확인(나머지 기수 미확인), 후원 발견 0건
  - 구름톤 in JEJU 18기 — 모집 2026.7.6~7.19, 본행사 날짜 미확인(제주 3박 4일) — 해커톤 — 국내 — 주최(구름) — 모음 사이트: 미확인(검색 한도) — 근거: `https://9oormthon.goorm.io/`
- 예정(2026-11 이후): 공지 없음.
- 메모:
  - SOURCE_CANDIDATES 기준 연 4~5회다. 그 주기라면 기간 안에 3~4개 기수가 더 있었을 수 있다. 사이트는 같은 주소를 덮어써서 지난 기수 날짜가 남지 않는다.
  - 메인에 "직무별 전문 교육"과 "구름톤 딥다이브 서류 면제" 문구가 있다. 행사 자체는 해커톤이다.
  - 구름톤 유니브: 미확인. 추정 주소 `9oormthonuniv.goorm.io`는 구름 404 화면으로 넘어갔다.

## NASA Space Apps Challenge (국내 개최지)
- 조사 범위: robots, `/2025/` 페이지(2회).
- 공지 위치:
  - 공식 사이트 `https://www.spaceappschallenge.org` — 읽기: SSR / robots: 허용(`/private/`, `/api/`만 금지) / 연도 경로 `/{연도}/`
  - 숨은 API `https://api.spaceappschallenge.org/graphql` — 도시 목록. `event` ID가 필요하다(SOURCE_CANDIDATES 기준)
  - 공지 게시판 서울 행사 공지는 대학 게시판에 있다(SOURCE_CANDIDATES 기준, 검색 근거)
- 약관: 참가자용 `https://www.spaceappschallenge.org/legal/`만 있다(SOURCE_CANDIDATES 기준).
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건, 후원 발견 0건
  - 2025 회차 — 2025.10.4~5 — 기간 밖 — 근거: `https://www.spaceappschallenge.org/2025/` "On October 4-5, 2025"
- 예정(2026-11 이후): 2026.11.14~15. 서울 현장 행사 있음(EVENT_SITES 기준, 검색 근거). 온라인(virtual) 참가 지역도 있다(GraphQL 필드 `isVirtual`).
- 메모: 연 1회. 서울 행사의 주관 기관과 모음 사이트 등장 여부는 미확인(검색 한도).

## CCE (사이버공격방어대회)
- 조사 범위: 직접 요청 없음. SOURCE_CANDIDATES 기록을 인용했다.
- 공지 위치:
  - 공식 사이트 `https://cce.cstec.kr` — 읽기: CSR(단일 행사) / robots: robots.txt 자리에 HTML(규칙 0개) / 일정은 JS 번들에만 있다
  - SNS `https://www.youtube.com/@CCE-2025`
  - 모음 사이트 링커리어에 모집 공고(SOURCE_CANDIDATES 기준, 검색 근거)
- 약관: 없음. 개인정보처리방침 모달만 있다(SOURCE_CANDIDATES 기준).
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - 2026 제10회 CCE — 신청 7.24~8.18, 예선 8.22 온라인, 본선 9.17 서울 코엑스, 시상식 9.18 — 대회(CTF) — 국내 — 주최 국가정보원 — 모음 사이트: 링커리어(검색 근거) — 근거: SOURCE_CANDIDATES 기준
- 예정(2026-11 이후): 없음.
- 메모: 연 1회(2017~). 2024년부터 Cyber Summit Korea와 같이 연다.

## 핵테온 세종
- 조사 범위: robots, 메인(2회).
- 공지 위치:
  - 공식 사이트 `https://hacktheon.org` — 읽기: SSR(단일 행사) / robots: 허용(`Disallow:` 빈 값) / 일정·주최·후원·동시개최 행사가 본문 텍스트에 있다
  - 공지 게시판 `https://hacktheon.org/y2026/p6/c1/` — SSR(SOURCE_CANDIDATES 기준)
- 약관: 없음(SOURCE_CANDIDATES 기준).
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 2건(같은 행사 묶음), 후원 발견 0건
  - 2026 핵테온 세종 국제 대학생 사이버보안 경진대회 — 신청 3.23~4.22, 예선 4.25 온라인, 본선 7.9, 시상 7.10 정부세종컨벤션센터 — 대회(CTF) — 국내 — 주최 세종특별자치시·국가정보원, 주관 고려대 세종 외 — 모음 사이트: 미확인(검색 한도) — 근거: `https://hacktheon.org/`
  - 2026 핵테온 세종 AI·사이버보안 콘퍼런스 — 7.9~10 같은 장소 — 컨퍼런스 — 국내 — 같은 주최 — 모음 사이트: 미확인(검색 한도) — 근거: `https://hacktheon.org/`
- 예정(2026-11 이후): 없음.
- 메모:
  - 동시개최: 우주보안·양자보안 워크숍(한국정보보호학회), 국가 사이버안보 세미나(한국사이버안보학회), AI 혁신 아이디어 경진대회 등. 주최가 달라 세지 않았다.
  - 후원기관 18곳에 한국인터넷진흥원(KISA), 정보통신기획평가원(IITP)이 있다.

## POC (Power of Community)
- 조사 범위: robots, 메인, `/archive/2025`, `zer0con.org` robots·메인, `hackingcamp.org` robots·메인(7회).
- 공지 위치:
  - 공식 사이트 `https://powerofcommunity.net` — 읽기: SSR(단일 행사) / robots: robots 없음(404) / 바닥글 "Our Conference: POC Conference, Zer0Con, HackingCamp"
  - 공식 사이트 `https://powerofcommunity.net/archive/2025` — 읽기: SSR / 날짜·장소·발표·POC CTF 2025
  - 공식 사이트 `https://zer0con.org` — 읽기: SSR(단일 행사) / robots: robots 없음(404) / Organizer "POC Security", "Power of Community"
  - 공식 사이트 `https://hackingcamp.org` — 읽기: SSR / robots: robots 없음(404) / 1회(2009)~33회 날짜 목록이 한 페이지에 있다
  - SNS `https://x.com/POC_Crew`, `https://instagram.com/hackingcamp/`, `https://www.facebook.com/h4ckingc4mp/`
- 약관: 세 사이트 모두 약관 링크가 없다. 저작권 표기만 있다("© 2006 - 2026 Powerofcommunity All Rights Reserved").
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 3건(+애매 2건), 후원 발견 0건
  - POC2025 — 2025.11.13~14 포시즌스 서울 — 컨퍼런스 — 국내 — 주최 — 모음 사이트: 미확인(검색 한도) — 근거: `https://powerofcommunity.net/archive/2025`
  - POC CTF 2025 — 컨퍼런스 기간 중, Flagyard 협력 — 대회(CTF) — 국내 현장 — 주최 — 모음 사이트: 미확인(검색 한도) — 근거: 같은 페이지
  - Zer0Con 2026 — CFP 마감 2026.2.22, 행사 4.2~3 페어몬트 앰배서더 서울 — 컨퍼런스 — 국내 — 주최 — 모음 사이트: 미확인(검색 한도) — 근거: `https://zer0con.org/`
  - (애매) 제32회 동계 해킹캠프 — 2026.2.21~22 — 학생 대상 1박 2일 캠프(발표+CTF) — 국내 — 주최 — 모음 사이트: 미확인 — 근거: `https://hackingcamp.org/`
  - (애매) 제33회 하계 해킹캠프 — 2026.8.22~23 하이서울유스호스텔 — 같은 형식 — 국내 — 주최 — 모음 사이트: 미확인 — 근거: 같은 페이지
- 예정(2026-11 이후): POC2026 11.12~13 웨스틴 서울 파르나스(The Westin Seoul Parnas)(등록 9.1 시작).
- 메모:
  - POC 11월, Zer0Con 4월, 해킹캠프 2월·8월. 연 4회 행사다.
  - 해킹캠프는 "비영리 캠프", 대상은 중·고·대학생, 정원 60명 내외다. 교육 과정으로 볼지 세미나로 볼지 판단이 필요하다.
  - 해킹캠프 페이지 머리는 "제33회 … 종료", 안내 블록 제목은 "34회"인데 날짜가 33회와 같다(8.22~23).

## 화이트햇 콘테스트
- 조사 범위: 직접 요청 없음(EVENT_SITES 기준 TLS 실패, 재시도 안 함). 검색 0회(한도).
- 공지 위치:
  - 공식 사이트 `https://whitehatcontest.kr` — 읽기: 불가 / robots: TLS 실패로 미확인
  - 모음 사이트 콘테스트코리아·요즘것들·슥삭 목록에 "화이트햇 2026 국방 사이버보안 콘테스트"(SOURCE_CANDIDATES 기준)
- 약관: 미확인.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 미확인, 후원 발견 0건
  - 화이트햇 2026 국방 사이버보안 콘테스트 — 날짜 미확인 — 대회(CTF) — 국내 — 주최 국방부·주관 사이버작전사령부(SOURCE_CANDIDATES 기준, 검색 근거) — 모음 사이트: 콘테스트코리아·요즘것들·슥삭 — 근거: SOURCE_CANDIDATES 기준
  - 2025 회차 — 날짜 미확인. 본선이 2025-11 이후면 기간에 들어간다
- 예정(2026-11 이후): 미확인.
- 메모: 2013년부터 매년(검색 근거).

## NIPA (정보통신산업진흥원)
- 조사 범위: `oss.kr` robots·공지 2페이지(pageSize=30, 56건 전체), `nipa.kr` robots·공지 1페이지(5회).
- 공지 위치:
  - 공지 게시판 `https://www.oss.kr/pages/10` — 읽기: 운영(oss-notice) / robots: 허용 / 56건 전체. 분류 `[개발자대회]`, `[행사안내]`, `[아카데미]`가 있다
  - 공지 게시판 `https://www.nipa.kr/home/2-1` — 읽기: SSR / robots: 허용(Googlebot 그룹만) / 1페이지 13건 중 NIPA 주최 개발 행사 0. `[유관기관]` 타 기관 행사 안내가 섞인다
  - 공지 게시판 `https://www.nipa.kr/home/2-2` — 사업공고. 10건 중 개발 0(EVENT_SITES 기준)
- 약관: `https://www.nipa.kr/home/6-1` 제15조 "② 서비스를 이용하여 얻은 정보를 정보통신산업진흥원의 사전승낙 없이 … 제3자에게 제공하는 행위" 금지(SOURCE_CANDIDATES 기준).
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건(+2025 회차 시상 미확인), 후원 발견 0건
  - 2026년 오픈소스 개발자대회(20주년) — 개막 공지 2026.6.15, 접수·본선 날짜 미확인(상세 미요청) — 공모전 — 국내 — 주최·주관 표기 미확인 — 모음 사이트: 미확인(검색 한도) — 근거: `https://www.oss.kr/pages/10` 4540
  - 2025년 오픈소스 개발자대회 — 오리엔테이션 공지 2025.7.14. 시상 날짜 미확인 — 근거: 같은 목록 189
- 예정(2026-11 이후): 2026 개발자대회 시상 시점 미확인.
- 메모:
  - 뺀 것: 2026 NIPA 통합 사업설명회(2026.1.21, 사업 안내), 오픈소스 컨트리뷰션 아카데미(컨트리뷰톤, 교육), AI·SW 인재 양성 과정(교육), 오픈소스 AI 매니지먼트 아카데미(교육).
  - 주최가 NIPA가 아닌 안내: 래블업 AI 인프라 기술 컨퍼런스(9/29, oss.kr `[행사안내]`), 한국산업기술진흥원 중견기업 혁신 컨퍼런스 등(nipa.kr `[유관기관]`).
  - oss.kr 게시량은 1년에 약 20건이다. 개발 행사 공지는 개발자대회 1건뿐이다.

## NIA (한국지능정보사회진흥원)
- 조사 범위: `nia.or.kr` robots·공지 2페이지, AI Hub robots·공지 1페이지(5회). 검색 2회(ICPC 항목과 공유).
- 공지 위치:
  - 공지 게시판 `https://www.nia.or.kr/site/nia_kor/ex/bbs/List.do?cbIdx=99835` — 읽기: SSR / robots: 허용(`*` `Allow: /`, Googlebot만 게시판 금지) / 2페이지 20건이 2026-08-13~10-23이다(고정 3건 제외)
  - 공지 게시판 `https://www.aihub.or.kr/aihubnews/notice/list.do?currMenu=132&topMenu=103` — 읽기: SSR / robots: 허용(Googlebot 그룹만) / 바닥글에 한국지능정보사회진흥원 주소가 있다
- 약관: 이용약관 없음. 저작권 정책 "… 링크하거나 인용, 복제 및 재배포 등을 통하여 사용하실 때 … 사전에 협의를 하고 허락을 얻고"(SOURCE_CANDIDATES 기준). AI Hub 제16조 2항 배포 금지(SOURCE_CANDIDATES 기준).
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 확인 1건 + NIA 공지 행사 5건(역할 미확인), 후원 발견 0건. 공지는 2.5개월분만 봤다
  - 제25회 대학생 프로그래밍 경시대회(2025 ICPC Seoul Regional) — 본선 2025.11.22 부산 벡스코 — 대회 — 국내 — 주관(검색 근거) — 모음 사이트: 찾지 못함 — 근거: `https://newsseoul.co.kr/news/view/1065607810378107`
  - 공공 웹사이트 불법광고 탐지 도구 개발 공모전 — 접수 9.14~10.23(제목 기준) — 공모전 — 국내 — NIA 공지(AI정부혁신성과팀), 주최·주관 미확인 — 모음 사이트: 미확인(검색 한도) — 근거: NIA 공지 2페이지
  - 제1회 AI 인프라 넥서스 콘퍼런스(AINEX 2026) — 공지 2026.9.4, 개최일 미확인 — 컨퍼런스 — 국내 — NIA 공지(통신서비스팀) — 모음 사이트: 미확인 — 근거: 같은 목록
  - 2026 오픈데이터포럼(ODF) 제2차 열린세미나 — 2026.9.11 — 세미나(애매: 데이터 정책) — 국내 — NIA 공지(공공지능데이터개방팀) — 모음 사이트: 미확인 — 근거: 같은 목록
  - 2026 오픈데이터포럼(ODF) 제3차 열린세미나 — 2026.10.20 — 같은 성격 — 근거: NIA 공지 1페이지
  - 국내 sLLM 파인튜닝 챌린지(K-DATA SCIENCE 해커톤) — 접수 ~8.14(연장) — 해커톤 — 국내 — AI Hub 공지, 주최 미확인 — 모음 사이트: 미확인 — 근거: AI Hub 공지 1페이지
- 예정(2026-11 이후): 미확인.
- 메모:
  - 「2026 데이터+AI 혁신 챌린지」 통합 공고(9.1)가 NIA 공지에 있다. 빅콘테스트 부제와 같다. 빅콘테스트 로고에 NIA는 없다. 역할 미확인.
  - 2026 ICPC(제26회)의 NIA 주관 여부는 미확인이다.
  - 뺀 것: 탄소중립 혁신 아이디어 공모전, 미션·비전 아이디어 공모, 교육생 모집 2건, 국민평가단 모집.
  - 2.5개월에 행사 공지 5건이다. 12개월 전체는 이보다 많을 수 있다(미확인).

## KISA (한국인터넷진흥원)
- 조사 범위: `boho.or.kr` robots·메인·공지 2페이지, `knvd.krcert.or.kr` robots(5회). `kisa.or.kr`는 EVENT_SITES 기준 403이라 요청하지 않았다.
- 공지 위치:
  - 공식 사이트 `https://www.kisa.or.kr` — 읽기: 불가 / robots: 403 / EVENT_SITES 기준
  - 공지 게시판 `https://www.boho.or.kr/kr/bbs/list.do?menuNo=205022&bbsId=B0000132` — 읽기: SSR / robots: 허용(googlebot·Yeti 그룹만) / 2페이지 20건이 2025-06-30~2026-10-21이다. 개발 행사 0
  - 공식 사이트 `https://knvd.krcert.or.kr` — 읽기: CSR(robots.txt 자리에 SPA HTML) / 보호나라 메인이 "핵더 챌린지 플랫폼"으로 소개한다. 일정 미확인
  - `https://academy.kisa.or.kr` — 교육이라 보지 않았다
- 약관: 미확인.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건 확인(kisa.or.kr 미확인), 후원 발견 1건
  - 2026 핵테온 세종 — 2026.7.9~10 — 대회·컨퍼런스 — 국내 — 후원 — 모음 사이트: 미확인 — 근거: `https://hacktheon.org/` 후원기관 목록
- 예정(2026-11 이후): 미확인.
- 메모:
  - 보호나라 공지는 취약점 점검 모집, C-TAS 이벤트, 비개발 공모전이다. 행사 공지 위치가 아니다.
  - KISA 주최 해킹대회·챌린지 존재 여부는 kisa.or.kr 403과 검색 한도 때문에 미확인이다.

## IITP (정보통신기획평가원)
- 조사 범위: 직접 요청 없음(robots `*` `Disallow: /`, SOURCE_CANDIDATES 기록). 검색 0회(한도).
- 공지 위치:
  - 공식 사이트 `https://www.iitp.kr` — 읽기: 불가 / robots: 금지(전체)
- 약관: 미확인.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 미확인, 후원 발견 1건
  - 2026 핵테온 세종 — 2026.7.9~10 — 대회·컨퍼런스 — 국내 — 후원 — 모음 사이트: 미확인 — 근거: `https://hacktheon.org/` 후원기관 목록
- 예정(2026-11 이후): 미확인.
- 메모: 핵테온 동시개최에 "IITP 정보보호 R&D 협의체"가 있다. 협의체 회의라 행사로 세지 않았다.

## 묶음 요약
- 대회 브랜드는 대부분 연 1회다. 기간 안 확인 건수: ICPC 2(1건은 11월 본선 예정), UCPC 2(대회+세미나), Codegate 1, 빅콘테스트 1, Junction 1, 구름톤 1(나머지 기수 미확인), CCE 1, 핵테온 2, POC 3(+해킹캠프 2 애매), NASA 0(2026은 11월 예정), 화이트햇 미확인.
- 공공기관은 행사 공지가 운영 공지에 섞인다. NIA는 2.5개월에 5건, NIPA는 개발자대회 1건, KISA·IITP는 직접 확인 0건(각각 403·robots 금지)이고 핵테온 후원만 보였다.
- 읽기 방식: 단일 행사 사이트는 대부분 SSR이다. CSR은 Junction 3개 사이트, CCE, KNVD다. 불가는 Codegate·KISA(403), 화이트햇(TLS), IITP(robots)다. 공식 RSS는 ICPC뿐이다.
- 검색 한도(세션 공용 200회)가 조사 초반에 다 찼다. 모음 사이트 등장은 ICPC 2026(링커리어), UCPC 2026(씽유), Codegate(CTFtime), CCE(링커리어), 화이트햇(콘테스트코리아 등)만 확인했고 나머지는 미확인이다.
