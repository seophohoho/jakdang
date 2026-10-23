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
- **"미확인"은 "없음"이 아니다.** 아래 표의 모음 사이트 칸은 확인된 것만 적었다.
- **행사 수는 하한값이다.** 찾은 것만 셌다.
- **ticketa는 예외다.** 커뮤니티 묶음이 ticketa 전체 목록 135건을 1회 받아 직접 대조했다. 그래서 커뮤니티 행사의 ticketa 등장 여부는 확인됐다.
- **조사 규칙 이탈:**
  - Cursor 조사 중 Luma 개별 행사 페이지 2곳(`luma.com/2s524ldj`, `luma.com/6y8qjtgr`)을 캘린더로 잘못 알고 요청했다. 개별 공고 상세는 요청하지 않는 규칙이었다.
  - 주최 하나당 직접 요청 기준(10회 안팎)을 넘었다. 삼성·LG·현대자동차그룹은 11~14회, KT는 약 14회다. 계열사 여러 호스트에 나눠 보낸 요청이다.

## 재조사 계획 (새 세션)

사용자가 정한 순서: 체크를 먼저 하고(72곳), 모음 사이트 등장 여부는 새 세션에서 웹 검색으로 다시 조사한다.

- 목적: 체크한 주최의 행사가 모음 사이트에도 올라왔는지 확인해 "모음 사이트에서 잡히는 비율"을 낸다. 이 비율은 "주최별 직접 수집"과 "모음 사이트 + 주최 이름 필터" 중 하나를 고를 때 근거다.
- 대상: 이 문서와 [named-orgs-survey/](named-orgs-survey/)에서 찾은 행사 중 체크한 72곳의 것. AWSKRUG·GDG처럼 15건을 넘는 곳은 대표 행사만 본다.
- 모음 사이트: 이벤터스, ticketa, OKKY, Luma, Meetup, 위비티, 링커리어. 커뮤니티 행사의 ticketa 등장은 이미 확인했다.
- 한도: 웹 검색은 세션당 200회이고, 같은 세션의 서브에이전트가 이 한도를 나눠 쓴다. 행사 약 150건 × 모음 사이트 7곳은 200회를 넘는다. 에이전트를 나눠 돌리면 에이전트마다 검색 횟수를 미리 배정한다.
- 멈추는 조건: 표본 몇십 건만으로도 비율이 뚜렷하게 나오면 중간에 멈춘다.

## 한눈에 보기

칸의 뜻:

- 행사: 기간 안 주최·주관 건수. 괄호는 후원 발견 건수나 단서다.
- 읽을 수 있는 공지 위치: 봇이 robots·읽기 방식상 받을 수 있는 곳만 적었다. 막힌 곳은 "막힘"으로 따로 적었다.
- 모음 사이트: 등장이 확인된 곳만 적었다. "—"는 확인된 등장이 없다는 뜻이다(미확인 포함).

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

기수 모집은 행사로 세지 않고 따로 적었다. 넣을지는 아직 정하지 않았다.

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

## 판단이 필요한 항목

조사 중 "결정" 절 규칙만으로 넣을지 정하기 어려웠던 것이다.

- 카카오 "AI 돛 Summit": 인재 양성 프로그램이 연 행사일 수 있다(교육 프로그램 행사는 제외 규칙).
- 카카오 증권사 대상 고객 세미나: 개발자 행사인지 애매하다.
- LINE Tech-Verse 2026(2026-06-29 온라인): 일본 LY Corporation 주최 시청형이라 뺐다. 한국어 페이지와 LINE Plus 발표자가 있다.
- 크래프톤 해커톤 3건: 채용 혜택이 붙는다(채용설명회는 제외 규칙).
- 스마일게이트 비버롹스 2025(축제), 전시팀 모집, 프로토타이핑 챌린지: 행사 종류가 애매하다.
- 넥슨게임즈 디지털아트 공모전: 개발이 아닌 아트 공모전이다.
- POC 해킹캠프 2회: 교육으로 볼지 애매하다.
- 사내·초청 전용 행사: LG AI 데브콘, SKT AX 챌린지, SK AI 솔루션 리그, 현대차 24H 코드 레이스, KT Agent Camp 등. 보도자료 제목만으로는 사내 행사와 공개 행사를 구분할 수 없다.
- 동아리 기수 모집: 행사로 세지 않았다. 넣을지 정하지 않았다.

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
