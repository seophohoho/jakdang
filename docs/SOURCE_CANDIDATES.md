# 수집 후보 사이트 조사

확인 날짜: 2026-10-23 (한국 시간). 확인 시각은 09:52~10:22 KST다.

조사 방법:

- 봇 UA(`Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)`)로만 요청했다. 브라우저 UA로 바꾸지 않았다.
- 같은 호스트에는 1초 간격을 뒀다. robots.txt에 `Crawl-delay`가 있으면 그 값을 따랐다.
- 요청한 것: robots.txt, 목록 페이지(1~2페이지), 이용약관·운영정책, 단일 행사 사이트의 메인·지난 회차·아카이브. 개별 행사·공고 상세, 신청·결제, 로그인 페이지는 요청하지 않았다.
- 목록 내용은 1회 스냅샷이다. 건수와 개발 비율은 확인 시각 기준이다.
- 숨은 API는 robots가 허용하고 인증·토큰이 필요 없을 때만 엔드포인트당 1회 호출했다.
- robots 금지, 403, Cloudflare 확인 화면, 로그인 요구, 점검 화면은 우회하지 않고 그대로 기록했다.
- 스크립트를 실행하지 않은 원본 HTML로 판정했다.
- 약관은 원문의 핵심 구절만 인용했다. 검색으로 안 사실은 "검색 근거"라고 적었다.
- 운영 소스 3곳(위비티, DACON, 오픈소스 포털)의 읽기 방식과 약관은 [SOURCES.md](SOURCES.md)에 있다.

개발 행사는 소프트웨어·AI·데이터·보안·게임 개발·클라우드·로봇·하드웨어 프로그래밍·개발자 컨퍼런스·해커톤이다. 비개발은 영상·디자인·마케팅·슬로건·교육생 모집·채용 등이다. 둘 다 아니면 "애매"로 셌다.

이 문서는 어느 방식을 쓸지 정하지 않는다. 사이트마다 확인된 읽기 경로와 약관 원문만 적는다.

## 읽기 방식 구분

| 구분 | 뜻 | 필요한 도구 |
| --- | --- | --- |
| SSR | 받은 HTML에 목록이 이미 있다 | 지금 방식(fetch + cheerio) |
| 내장 데이터 | 화면 HTML에는 없고, HTML 속 `<script>`에 목록 JSON이 있다 | fetch + JSON 파싱 |
| 숨은 API | 페이지 스크립트가 목록을 따로 받아 오는 주소다. 공개 약속이 없어 예고 없이 바뀐다 | fetch(JSON) |
| 공식 API·RSS | 사이트가 공개한 데이터 주소다 | fetch(JSON·XML) |
| CSR | 위 경로를 찾지 못했다. 브라우저가 스크립트를 돌려야 보인다 | 헤드리스 브라우저 |
| AI 추출 | 가져온 내용을 LLM이 읽고 행사만 골라낸다. 가져오는 방법이 아니라 해석하는 방법이다 | LLM 또는 외부 AI 에이전트 |

## 한눈에 보기

조항 칸의 뜻:

- 없음: 약관은 있지만 해당 조항을 찾지 못했다. 약관 없음: 사이트에 이용약관이 없다. 미확인: 약관 원문을 받지 못했다
- 회원 대상 금지: 금지 조항의 주어가 회원이다. 이용자 대상 금지: 주어가 "이용자"인데 비회원 포함 여부를 약관이 정의하지 않았다
- 비회원 포함 금지: 약관이 비회원·방문자 전체에 적용된다고 적었다

| 사이트 | 분야 | 읽기 | 자동 수집 조항 | 재배포·제3자 제공 조항 | 개발 비율 / 개최 주기 |
| --- | --- | --- | --- | --- | --- |
| 위비티 | 공모전 | 운영 | SOURCES.md | SOURCES.md | SOURCES.md |
| 콘테스트코리아 | 공모전 | SSR | 없음 | 없음 | 12건 중 개발 4 |
| 링커리어 | 공모전 | SSR·내장 데이터 | 회원 대상 금지 | 회원 대상 금지 | 일반 20건 중 개발 4 |
| 씽굿 | 공모전 | 숨은 API | 없음 | 이용자 대상 금지 | 10건 중 개발 6 |
| 올콘 | 공모전 | 숨은 API | 없음 | 회원 대상 금지 | 15건 중 개발 12 |
| 대티즌 | 공모전 | 숨은 API | 비회원 포함 금지 | 비회원 포함 금지 | 27건 중 개발 0 |
| 캠퍼스픽 | 공모전 | SSR | 비회원 포함 금지 | 비회원 포함 금지 | 24건 중 개발 3 |
| 요즘것들 | 공모전 | 내장 데이터 | 회원 대상 금지 | 비회원 포함 금지 | 일반 16건 중 개발 7 |
| 씽유 | 공모전 | SSR | 없음 | 이용자 대상 금지 | IT·SW 33건 중 개발 13 |
| 슥삭 | 공모전 | 숨은 API | 회원 대상 금지 | 회원 대상 금지 | 13건 중 개발 2 |
| DACON | AI·데이터 | 운영 | 없음 | 회원 대상 금지 | SOURCES.md |
| AI Hub | AI·데이터 | SSR | 없음 | 회원 대상 금지(제16조는 "귀하") | 2페이지 20건 중 개발 2 |
| 공공데이터포털 | AI·데이터 | SSR | 없음 | 회원 대상 금지 | 2페이지 20건 중 개발 1 |
| 빅콘테스트 | AI·데이터 | SSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회(9~10월) |
| Kaggle | AI·데이터 | CSR | 금지(검색 근거) | 금지(검색 근거) | 미확인 |
| 구름톤 | 해커톤 | SSR(단일 행사) | 없음 | 회원 대상 금지 | 연 4~5회(기수제) |
| DAKER | 해커톤 | CSR(사이트맵) | 없음 | 회원 대상 금지 | 해커톤 22개 중 개발 20(slug 기준) |
| JunctionX Korea | 해커톤 | CSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회(8월) |
| 프로그래머스 | 해커톤 | 숨은 API | 회원 대상 금지 | 회원 대상 금지 | 10건 중 개발 3, 모두 종료 |
| Devpost | 해커톤 | 숨은 API | 비회원 포함 금지 | 비회원 포함 금지 | "Korea" 검색 1건 |
| HackQuest | 해커톤 | 내장 데이터 | 비회원 포함 금지 | 없음 | 본 9건 중 한국 개최 0 |
| NASA Space Apps | 해커톤 | SSR(단일 행사) | 약관 없음(참가자 약관만) | 약관 없음(참가자 약관만) | 연 1회(11월) |
| ICPC Korea | 알고리즘 | 공식 RSS | 약관 없음 | 약관 없음 | 연 1회(10~11월) |
| UCPC | 알고리즘 | SSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회(여름) |
| SCPC | 알고리즘 | SSR(단일 행사) | 없음 | 비회원 포함 금지 | 연 1회(여름) |
| 한국정보올림피아드 | 알고리즘 | 공식 RSS(Atom) | 약관 없음 | 약관 없음 | 연 1회(1·2차) |
| CTFtime | 보안 | 공식 API·RSS | 약관 없음 | API 안내: 클론 운영 금지 | 예정 42건 중 한국 0 |
| CCE | 보안 | CSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회(9월 본선) |
| 핵테온 세종 | 보안 | SSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회(5~7월) |
| KISIA | 보안 | 불가(점검) | 미확인 | 미확인 | 미확인 |
| POC | 보안 | SSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회(11월) |
| 화이트햇 콘테스트 | 보안 | 불가(TLS) | 미확인 | 미확인 | 연 1회(검색 근거) |
| 이벤터스 | 모음 | 숨은 API | 없음 | 비회원 포함 금지 | 30건 중 개발 6 |
| Meetup (AWSKRUG) | 모음 | 내장 데이터 | 미확인 | 미확인 | 17건 중 개발 17 |
| Luma 서울 | 모음 | 내장 데이터 | 비회원 포함: 공개 인터페이스 외 접근 금지 | 비회원 포함 금지 | 12건 중 개발 3 |
| ticketa | 모음 | 숨은 API | 없음 | 회원 대상 금지 | 예정 22건 중 개발 12 |
| GDG 서울 | 모음 | 내장 데이터 | 없음(Google 약관은 robots 위반만) | 없음(GDG 약관) | 예정 0건, 연 3~4회 |
| OKKY | 모음 | SSR | 없음(자동 게시·변조만) | 없음 | 20건 중 개발 8 |
| AWS 코리아 이벤트 | 모음 | SSR | 비회원 포함 금지 | 비회원 포함 금지(상업 목적) | 개별 행사 0건 |
| 요즘IT | 모음 | 공식 RSS | 없음(외주 정보 크롤링만) | 회원 대상 금지(상업 목적) | 30건 중 행사 글 1 |
| if(kakao) | 기업 컨퍼런스 | SSR(단일 행사) | 미확인 | 미확인 | 매년(9~10월) |
| DEVIEW | 기업 컨퍼런스 | SSR(아카이브) | 이용자 대상 금지 | 이용자 대상 금지 | 2023 이후 단독 회차 없음 |
| DAN | 기업 컨퍼런스 | CSR(단일 행사) | 이용자 대상 금지 | 이용자 대상 금지 | 2024·2025 11월 |
| 우아콘 | 기업 컨퍼런스 | CSR(단일 행사) | 약관 없음 | 약관 없음 | 매년(10월) |
| SLASH | 기업 컨퍼런스 | SSR(단일 행사) | 없음 | 회원 대상 금지 | 2021~2024 매년 |
| NDC | 기업 컨퍼런스 | CSR(단일 행사) | 없음 | 회원 대상 금지 | 매년(6월) |
| AWS Summit Seoul | 기업 컨퍼런스 | SSR(단일 행사) | 비회원 포함 금지 | 비회원 포함 금지(상업 목적) | 매년(5월) |
| AI Summit Seoul & Expo | 기업 컨퍼런스 | SSR(단일 행사) | 약관 없음 | 약관 없음(푸터에 무단 복제 금지) | 매년(8월) |
| AI EXPO KOREA | 기업 컨퍼런스 | SSR(단일 행사) | 약관 없음 | 약관 없음 | 매년(4~5월) |
| KGC | 기업 컨퍼런스 | 불가(인증서) | 미확인 | 미확인 | 최근 회차 근거 없음 |
| SK AI Summit | 기업 컨퍼런스 | 불가(시간 초과) | 미확인 | 미확인 | 2024·2025 11월(검색 근거) |
| FEConf | 커뮤니티 컨퍼런스 | SSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회 |
| PyCon Korea | 커뮤니티 컨퍼런스 | CSR(단일 행사) | 약관 없음(robots Content-Signal) | 약관 없음 | 연 1회(8월) |
| 드로이드나이츠 | 커뮤니티 컨퍼런스 | SSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회 |
| let'swift | 커뮤니티 컨퍼런스 | SSR(단일 행사)·`.ics` | 약관 없음 | 약관 없음 | 연 1회 |
| GopherCon Korea | 커뮤니티 컨퍼런스 | CSR(단일 행사) | 약관 없음 | 약관 없음 | 연 1회, 2026 미확인 |
| JSConf Korea | 커뮤니티 컨퍼런스 | SSR(단일 행사) | 약관 없음 | 약관 없음 | 2022 이후 회차 없음 |
| 인프콘 | 커뮤니티 컨퍼런스 | SSR(단일 행사) | 미확인 | 미확인 | 2022~2024, 2025 휴식 |
| 오픈소스 포털 | 공공 | 운영 | SOURCES.md | SOURCES.md | SOURCES.md |
| NIPA | 공공 | SSR | 없음 | 이용자 대상 금지 | 10건 중 개발 0 |
| NIA | 공공 | SSR | 없음 | 사전 협의 요구(저작권 정책) | 10건 중 개발 0 |
| 한국콘텐츠진흥원 | 공공 | 불가(robots) | 없음 | 공공누리 유형별 | 첫 화면 10건 중 개발 0 |
| AI·SW중심대학협의회 | 공공 | SSR | 미확인 | 미확인 | 공지 일반 10건 중 개발 3 |
| K-Startup | 공공 | 공식 API(인증키) | 없음 | 이용허락범위 "제한 없음" | 미확인 |

## 1. 공모전·대외활동 모음

위비티는 운영 중이다([SOURCES.md](SOURCES.md)).

### 콘테스트코리아

- 목록 URL: `https://www.contestkorea.com/sub/list.php?int_gbn=1&Txt_bcode=030310001` (학문•과학•IT)
- 읽기: SSR. 받은 HTML의 `div.list_style_2 > ul > li`에 12건이 있다. robots `Allow:/`
  - 선택자: 제목 `div.title a span.txt`, 분류 `span.category`, 주최 `ul.host li.icon_1`, 대상 `li.icon_2`, 일정 `div.date-detail span.step-1/2/3`, D-day `div.d-day span.day`, 상태 `span.condition`
  - 항목 ID: `str_no`(12자리). 목록 밖에도 `str_no=` 링크가 30개 넘게 있다. 조건부 요청: 없음. 페이지네이션: `page=N`, 12건씩 353쪽(4,283건). 정렬이 `Txt_sortkey=a.int_sort`라 1페이지가 날짜순이 아니다
- 내용: 12건 중 개발 4 / 비개발 5 / 애매 3 / 광고 0. 칸: 분류, 주최, 대상, 접수·심사·발표 기간(연도 없음), D-day, 상태, 좋아요 수
- 약관: `https://www.contestkorea.com/terms/service.php`(2019-05-13). 자동 수집·재배포 조항은 찾지 못했다. 주어는 "회원"이다
  - 제9조 "회원은 서비스를 이용하여 얻은 정보를 가공, 판매하는 행위 등 서비스에 게재된 자료를 상업적으로 이용할 수 없습니다."
- 미확인: 2페이지 실제 응답, 등록일순 정렬 파라미터

### 링커리어

- 목록 URL: `https://linkareer.com/list/contest`
- 읽기: SSR + 내장 데이터. robots `Allow: /`
  - HTML: `h5.activity-title` 28개. 추천 항목은 제목 앞에 `span[class^="RecommendedTag"]`가 붙는다. 내장 데이터: `__NEXT_DATA__` Apollo 상태 `Activity:{id}`의 `title`, `organizationName`, `recruitCloseAt`(epoch ms), `viewCount`. 추천은 `ActivityWithAd` 8개
  - 항목 ID: `/activity/{id}`. 페이지네이션: `?page=N`, 일반 20건씩(2페이지 확인), 677건. 조건부 요청: `etag`가 요청마다 바뀌어 200이 온다
- 내용: 일반 20건 중 개발 4 / 비개발 14 / 애매 2. 추천 8건 중 개발 1. 칸: 주최, D-day, 조회·댓글·스크랩 수, 팀원 모집 글 수
- 약관: `https://linkareer.com/terms`(2026.08.12). 조항 주어는 모두 "회원"이다
  - 제39조 "자동화 프로그램·매크로 등 기계적 수단을 이용하여 서비스에 접근하거나 게시물을 작성·전송하는 행위" 제28조 ""서비스"는 정보취득 또는 개인용도로만 제공되는 형태로 "회원"이 이용할 수 있습니다."
- 미확인: 제39조가 비회원 봇에 적용되는지, GraphQL 목록 조회 방법

### 씽굿

- 목록 URL: 화면 `https://www.thinkcontest.com/thinkgood/user/contest/index.do`, 데이터 `POST https://www.thinkcontest.com/thinkgood/user/contest/subList.do`
- 읽기: 숨은 API. 화면은 빈 `tbody#dataList`이고 `contest.js`의 `getContestList`가 JSON을 POST한다. 인증·토큰 없음
  - 본문: `{"recordsPerPage":20,"currentPageNo":1,"contest_field":"CCFD002","host_organ":"","enter_qualified":"","award_size":"","searchStatus":"Y","sidx":"putup_sdt","sord":"DESC"}`
  - 데이터 경로: `listJsonData[]`의 `program_nm`, `contest_field_nm`, `host_company`, `dday`, `receive_period`, `process_nm`, `putup_sdt`, `award_size_nm`, `hit`. 응답에 담당자 개인정보 칸이 있다. 항목 ID: `contest_pk`. 페이지네이션: `currentPageNo`, 10건 고정, `totalcnt` 2,022. 분야 `CCFD002`(게임/소프트웨어) 필터 동작. 조건부 요청: 없음
- 내용: 10건 중 개발 6 / 비개발 0 / 애매 4 / 광고 0. 항목 하나에 분야가 여러 개 붙는다
- 약관: `https://www.thinkcontest.com/thinkgood/user/info/userTerm.do`(2023-01-01). 자동 수집 조항은 찾지 못했다
  - 제24조 "이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전승낙 없이 … 영리목적으로 이용하거나 제 3자에게 이용하게 하여서는 안됩니다." 제19조(회원)에는 "타인에게 제공할 수 없습니다"
- 미확인: 2페이지 응답, 분야 코드 전체 목록

### 올콘

- 목록 URL: 화면 `https://www.all-con.co.kr/list/contest/1`, 데이터 `POST https://www.all-con.co.kr/page/ajax.contest_list.php`
- 읽기: 숨은 API. `jquery.rumiPaging.js`가 `#fsearch` 폼 값을 폼 인코딩으로 POST한다. 인증 없음. 응답은 JSON, 헤더는 `text/html`
  - 본문: `sortorder=asc&page=1&sortname=cl_order&ct[]=5&sc[]=31&stx=&sfl=&rows=15&t=1` (`ct` 5 = 과학·공학·학술, `sc` 31 = 개발)
  - 데이터 경로: `rows[]`의 `cl_title`(배지 HTML 섞임), `cl_cate`, `cl_host`(말줄임), `cl_date`, `cl_status`, `cl_view`, `cl_is_star`. 응답에 서버 SQL 문(`sql` 키)이 있다. 항목 ID: `cl_srl`. 페이지네이션: `page`, `rows`, `totalCount` 16. 정렬 `cl_order`·`cl_view`·`cl_end_date`. 조건부 요청: `Last-Modified`가 응답 시각과 같다
- 내용: 15건 중 개발 12 / 비개발 0 / 애매 2 / 고정 1(`cl_is_star:1`). 칸: 분류, 대상, 주최, 접수 기간(연도 포함), 상태, D-day, 조회수
- 약관: `https://www.all-con.co.kr/content/provision`(2012-04-10). 자동 수집 조항은 찾지 못했다. 주어는 "회원"이다
  - 제3장 제2조 4항 "⑪ 올콘의 서비스를 이용하여 얻은 정보를 올콘의 사전 승낙 없이 복제 또는 유통시키거나 상업적으로 이용하는 행위"
- 미확인: 2페이지 응답, 별표 항목이 유료 광고인지

### 대티즌

- 목록 URL: 데이터 `GET https://www.detizen.com/api/contests/all` (첫 화면 `https://www.detizen.com/`)
- 읽기: 숨은 API. 첫 화면 스크립트(`0xrqs0d4_3hog.js`)에 주소가 있다. robots.txt 404
  - 데이터 경로: JSON 배열. 키는 `id`, `title`, `slug`, `end_date`, `thumbnail_key` 5개다. 항목 ID: UUID `id`(끝 3건은 `slug`가 깨지고 `end_date`가 null). 페이지네이션·분류 파라미터·조건부 요청: 없음
- 내용: 27건 중 개발 0 / 비개발 25 / 애매 2. 서포터즈·인턴십 모집이 섞인다. 칸: 제목, 마감일, 썸네일
- 약관: 본문이 같은 스크립트 안 문자열이다(2026-05-15). 제3조 "본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다."
  - 제4조 "… 서비스의 정상적인 운영을 방해하는 방식(무단 크롤링, 리버스 엔지니어링, 공격적 질의 등)으로 서비스를 이용해서는 안 됩니다." 제9조 "이용자는 서비스를 이용함으로써 얻은 정보를 "회사"의 사전 승낙 없이 복제, 송신, 출판, 배포하거나 영리 목적으로 이용할 수 없습니다."
- 미확인: 이 API가 전체 목록인지(전체 목록은 Supabase 키 필요)

### 캠퍼스픽

- 목록 URL: `https://www.campuspick.com/contest`
- 읽기: SSR. 숨김 블록 `<div id="seo-fallback" hidden>`에 24건이 있다. 화면 목록은 `api2.campuspick.com`(robots 전체 금지)에서 받는다
  - 선택자: `#seo-fallback section > ul > li > a`, 제목 `h3`, 주최 `p`, 썸네일 `img`. 항목 ID: `/contest/view?id={id}`(내림차순). 페이지네이션: 없음(24개 고정). 조건부 요청: `etag`, `If-None-Match`에 304
- 내용: 24건 중 개발 3 / 비개발 19 / 애매 2 / 광고 0. 칸: 제목, 주최, 썸네일
- 약관: `https://www.campuspick.com/page/userserviceagreement`(2025-04-15). 제2조 "“이용자”란, 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다."
  - 제12조 "프로그램, 스크립트, 봇을 이용한 서비스 접근 등 사람이 아닌 컴퓨팅 시스템을 통한 서비스 접근 행위", "API 직접 호출, 유저 에이전트 조작, … 허가하지 않은 방식의 서비스 이용 행위"
  - 제9조 "이용자는 데이터베이스 제작자인 회사의 승인 없이 데이터베이스의 전부 또는 일부를 복제∙배포∙방송 또는 전송할 수 없습니다."
- 미확인: 커뮤니티이용규칙(`/page/rules`, robots 금지), 화면용 광고 여부

### 요즘것들

- 목록 URL: `https://www.allforyoung.com/posts/contest?tags=28` (공모전 > IT/AI/데이터)
- 읽기: 내장 데이터. `self.__next_f.push` 조각 3개를 이으면 React Query 캐시가 나온다
  - 데이터 경로: queryKey `["feed","list",{"category":"공모전","order":"latest","page":1,"tags":[28]}]`의 `data[]`. 원소 `{type, data}`, `type`은 `"ad"` 또는 `"post"`. 필드 `data.title`, `data.organization`, `data.dday`, `data.tags[].name`, `data.is_expired`. 항목 ID: `data.id`. 페이지네이션: `?tags=28&page=2` 동작, per_page 20, total 33. 조건부 요청: 없음. 광고 제목에 BOM 문자가 붙어 있다
- 내용: 20건(일반 16 + 광고 4). 일반 16건 중 개발 7 / 비개발 6 / 애매 3. 광고 4건에는 IT 태그가 없다. 칸: 주최, D-day(마감 날짜 없음), 태그, 마감 여부
- 약관: `https://www.allforyoung.com/legal/terms`(2020-01-13). 제2조 "이용자"는 회원 및 비회원이다
  - 제14조(회원의 의무) "자동 접속 프로그램 등을 사용하는 등 정상적인 용법과 다른 방법으로 "서비스"를 이용하여 "회사"의 서버에 부하를 일으켜 …"
  - 제12조 ""이용자"는 데이터베이스 제작자인 "회사"의 승인 없이 데이터베이스의 전부 또는 일부를 복제·배포·방송 또는 전송할 수 없습니다."
- 미확인: `order=latest` 외 정렬 값, 광고 자리가 고정인지

### 씽유

- 목록 URL: 전체 `https://thinkyou.co.kr/contest/`, IT·SW `https://thinkyou.co.kr/contest/?page=1&pagesize=45&serstatus=&serdivision=&serfield=5&sertarget=&serprizeMoney=&seritem=0&searchstr=`
- 읽기: SSR. HTML에 `div.tr` 45행. 필터를 GET 쿼리로 줘도 서버가 걸러 그린다. robots에 `*` 그룹이 없다
  - 선택자: `div.tr`(고정 `div.tr.notice`), 제목 `div.title a dl dt h3`, 주최 `dd`, 기간 첫 `div.etc`, 상태 `div.statNew p.icon`, 조회수 두 번째 `div.etc`. 항목 ID: `/contest/{id}/`. 페이지네이션: `page=N&pagesize=45`. 분야 `serfield` 0 아이디어·마케팅 ~ 5 IT·SW. 조건부 요청: 없음. 없는 주소에 200 + "페이지를 찾을 수 없습니다"
- 내용: 전체 45건 중 개발 1 / 비개발 27 / 애매 3 / 고정 14. IT·SW 33건 중 개발 13 / 비개발 13 / 애매 6 / 고정 1. IT·SW 비개발 13건 중 7건이 교육생 모집이다. DACON 대회가 "데이콘 …"으로 다시 올라온다
- 약관: `https://thinkyou.co.kr/member/yak.asp?memsort=1`(2018-03-01). 자동 수집 조항은 찾지 못했다. 조문이 씽굿과 거의 같다
  - 제17조 "이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전승낙 없이 … 영리목적으로 이용하거나 제 3자에게 이용하게 하여서는 안됩니다."
- 미확인: IT·SW 2페이지 실제 건수, 고정 14건이 유료 광고인지

### 슥삭

- 목록 URL: 화면 `https://www.ssgsag.kr/contest`, 데이터 `GET https://www.ssgsag.kr/api/posters?page=1&pageSize=20&ordering=-reg_date&category=0&interestIds=207`
- 읽기: 숨은 API. 화면 HTML과 RSC에 공고가 없다. 페이지 스크립트가 `fetch('/api/posters?'+params)`를 부른다. `Authorization`은 로그인 때만 붙는다
  - 파라미터: `category` 0 공모전(1 대외활동, 4 인턴, 7 교육), `ordering` `-reg_date`·`end_date`·`-save_count`·`-view_count`, `interestIds` 207 = IT/SW. 데이터 경로: `data[]`의 `posterName`, `posterEndDate`, `posterStartDate`, `dday`, `benefit`, `target`, `outline`, `keyword`, `isAd`. 항목 ID: `posterIdx`. `totalCount` 13. 조건부 요청: 없음
- 내용: 13건 중 개발 2 / 비개발 9 / 애매 2 / 광고 0. 비개발 9건 중 5건이 교육생 모집인데 `categoryName`이 "공모전"이다. 주최는 제목 앞 "[ ]"에 있다
- 약관: 원문은 `GET https://www.ssgsag.kr/api/terms-of-service`의 `content`(2022-11-27). 조항 주어는 모두 "회원"이다
  - 제18조 7항 "… 자동화된 수단(예: 매크로 프로그램, 로봇(봇), 스파이더, 스크래퍼 등)을 이용하여 … 서비스에 게재된 다른 회원의 아이디(ID), 게시물 등을 수집하거나 …" 제18조 2항 "… 상업적으로 사용하거나 제3자에게 제공할 수 없다."
- 미확인: `interestIds` 없는 전체 응답, 화면 카드에 보이는 칸

## 2. AI·데이터 경진대회

DACON은 운영 중이다([SOURCES.md](SOURCES.md)). DACON 약관 개정은 DAKER 항목과 마지막 장에 있다.

### AI Hub

- 목록 URL: `https://www.aihub.or.kr/aihubnews/notice/list.do?currMenu=132&topMenu=103`
- 읽기: SSR. robots에 `Googlebot` 그룹만 있다
  - 선택자: `table.list tbody tr td.subject a.btnView`(고정 `tr.top`). 등록일·조회수는 3·4번째 `td span`. 항목 ID: `data-key`(nttSn). `href`가 `#`라 링크는 직접 만든다. 페이지네이션: `pageIndex=N` GET 동작, 32쪽. 조건부 요청: 없음
- 내용: 1페이지 10건(고정 5) 중 개발 1. 2페이지 10건 중 개발 1. 나머지는 운영 공지다
- 약관: `https://www.aihub.or.kr/useStplat.do?currMenu=110&topMenu=110`(2018-01-01). 자동 수집 조항은 찾지 못했다. 제15조는 "회원", 제16조는 "귀하"
  - 제16조 2항 "귀하는 AI 허브에서 명시적으로 승인한 경우를 제외하고는 … 배포, … 상업적 이용 행위를 할 수 없으며, 제3자로 하여금 이와 같은 행위를 하도록 허락할 수 없습니다."
- 미확인: 제16조 "정보"에 공지 제목·링크가 들어가는지

### 공공데이터포털

- 목록 URL: `https://www.data.go.kr/bbs/ntc/selectNoticeListView.do`
- 읽기: SSR. robots에 `Googlebot` 그룹만 있다
  - 선택자: `td[data-label="제목"] a.title span`. 고정 `td[data-label="번호"] span.labelset.blue`. 항목 ID: `fn_view("NOTICE_…", "...")`의 첫 값. 페이지네이션: `?pageIndex=N` GET 동작, 269쪽. 조건부 요청: 없음
- 내용: 1페이지 10건(고정 3) 중 개발 1 / 비개발 5 / 애매 1. 2페이지 10건 중 개발 0(설문·수요조사 8). 제목 앞에 `[기관명]`이 붙는다
- 약관: `https://www.data.go.kr/ugs/selectPortalPolicyView.do#use_stplat`(2023-06-08). 자동 수집 조항은 찾지 못했다
  - 제15조 3항 "회원은 센터의 명시적인 사전 승인 없이 포털 서비스에 대한 지식재산을 이용하거나 제3자로 하여금 이용하게 해서는 안됩니다."
- 미확인: 공지 제목이 "포털 서비스에 대한 지식재산"에 들어가는지, 활용 공모전 전용 메뉴

### 빅콘테스트

- URL: `https://www.bigcontest.or.kr` (제목 "제14회 빅콘테스트|2026 데이터+AI 혁신 챌린지 통합 경진대회")
- 읽기: SSR. 일정·분야·상금·공지 4건이 본문에 있다. 고정 선택자는 없다(공지는 `h5`). robots `Allow: /`
- 최근 회차: 제14회. 시작 2026.9.8, 제출 마감 10.26, 수상자 발표 11.27, 시상식 12월. 주최 과학기술정보통신부·KAIT
- 개최 주기: 연 1회. 8~9월 시작, 10월 제출 마감(4회 2016, 5회 2017은 검색 근거)
- 주소 규칙: 같은 주소를 해마다 덮어쓴다. 아카이브 없음. 새 회차 신호: 제목의 "제N회". `last-modified`는 요청 시각과 같고 ETag는 없다
- 공지 채널: 첫 화면 공지(최신 2026.10.14), 유튜브 `https://www.youtube.com/@bigcontest`. RSS 없음
- 약관: 없음. 푸터 "Copyright © 2026 KAIT. All Rights Reserved."
- 미확인: 13회(2025) 일정, KAIT 약관 적용 여부

### Kaggle

- 목록 URL: `https://www.kaggle.com/competitions`
- 읽기: CSR. 5.4KB 앱 셸이고 reCAPTCHA Enterprise가 붙는다. 목록 API는 XSRF 토큰이 필요해 호출하지 않았다. robots.txt 404
- 내용: 확인 못 함. 장소·국가 칸이 없다
- 약관: `https://www.kaggle.com/terms`는 앱 셸이라 본문을 받지 못했다. 아래는 검색 근거다
  - "\"Crawls,\" \"scrapes,\" or \"spiders\" any page, data, or portion of or relating to the Services or Content (through use of manual or automated means)", "Copies or stores any significant portion of the Content"
  - 2016년 포럼 글에서 Kaggle 직원이 대회 페이지를 읽는 API에 "your use is fine, and not what that section is intended to stop"이라고 답했다
- 미확인: 약관 현재 원문(검색 요약끼리 문구가 엇갈렸다), 공식 API 인증 조건

## 3. 해커톤

### 구름톤

- URL: `https://9oormthon.goorm.io` (제목 "구름톤 in JEJU")
- 읽기: SSR(Oopy). 모집 상태·기간·장소가 본문 텍스트에 있다. `__NEXT_DATA__`에 Notion 블록 데이터가 있다
- 최근 회차: 18기. 모집 07.06(월)~07.19(일), 연도 표기 없음(요일로 2026). "모집 종료". 본행사 날짜는 텍스트에 없다
- 개최 주기: 1년에 4~5회. 1기 2022년 8월(검색 근거), 2026년 7월에 18기
- 주소 규칙: 같은 주소를 기수마다 덮어쓴다. 공지만 `/notice/{N}th`. 아카이브 `https://9oormthon.goorm.io/collection`. 새 회차 신호: 강한 ETag(`"549176-3483451485"`). 사이트맵 경로가 기수를 드러낸다
- 공지 채널: 공식 사이트, 사이트맵 `/notice/{N}th`(lastmod 없음)
- 약관: `https://accounts.goorm.io/terms`(2025-10-30, "구름 브랜드를 사용하는 서비스"). 크롤링 명시 조항은 없다. 제20조 "회원은 … 영리목적으로 이용하거나 제3자에게 이용하게 할 수 없습니다."
- 미확인: 18기 본행사 날짜, 19기 모집 시점

### DAKER (데이커)

- 목록 URL: `https://daker.ai/public/hackathons`
- 읽기: CSR. 루트와 목록 모두 7,760바이트 셸이다
  - 번들(`/assets/index-BsT1cm3W.js`)에 `/api/hackathons/public-list?limit=9`, `/api/hackathons`가 있다. robots가 `/api/`를 막아 호출하지 않았다. HTML 주석: "크롤러는 crawlerRedirect.ts 가 경로별 self-canonical 을 SSR 로 내려주고". 이 봇 UA는 셸을 받았다
  - 사이트맵 `https://daker.ai/sitemap.xml`(569KB): `urlset > url > loc`가 `https://daker.ai/public/hackathons/{slug}`인 항목 22개, `lastmod` 있음, 제목 없음
- 내용: 해커톤 22개 중 개발 20 / 애매 2(slug 기준). 운영은 데이콘(주)이다(ld+json `parentOrganization`)
- 약관: `https://dacon.io/more/notice/137`(2026-08-21). 제2조 1항 "가. .dacon.io 나. daker.ai". 대상은 "회원"이다. 자동 수집 조항은 찾지 못했다
  - 제21조 7항 "“회원”은 서비스를 이용하여 얻은 정보를 “회사”의 사전동의 없이 복사, 복제, 번역, 출판, 방송 등의 방법으로 사용하거나 이를 타인에게 제공할 수 없다."
- 미확인: 해커톤 제목·마감·상태, DACON 목록과 겹치는 비율, 종료 해커톤이 사이트맵에 남는지

### JunctionX Korea

- URL: `https://asia.hackjunction.com` (제목 "JunctionX Korea 2026")
- 읽기: CSR(Vite). HTML 585바이트. 일정은 번들 `/assets/main-BmeXUf-l.js`의 `{date:"7/8",description:"…",kr_description:"…"}` 배열과 `"2026.08.21-23"`. robots.txt 404
- 최근 회차: 2026.08.21~23 포항, 종료. 7/8 모집 시작 → 7/26 마감 → 8/21 본행사. 신청 `https://hackjunction.app/events/junctionx-korea-2026`
- 개최 주기: 연 1회 8월. 2024 경주, 2025 포항("2025 Junction Asia Hackathon"), 2026 포항(검색 근거)
- 주소 규칙: 같은 주소를 해마다 덮어쓴다. 행사 이름이 해마다 바뀐다. 아카이브 없음. 새 회차 신호: `etag`, `last-modified`(S3 객체 기준), 번들 파일명 해시
- 공지 채널: 공식 사이트, Instagram `https://instagram.com/junctionasia`(번들 링크)
- 약관: 찾지 못함. Junction 2024 참가자 규칙(검색 근거)은 사이트 이용 약관이 아니다
- 미확인: Junction 플랫폼 이용약관, 2027 공지 시점

### 프로그래머스

- 목록 URL: 화면 `https://school.programmers.co.kr/competitions`, 데이터 `GET https://school.programmers.co.kr/api/competitions?registered=false&page=1`
- 읽기: 숨은 API. 인증 없이 JSON. robots는 `/api/competitions`를 허용한다
  - 데이터 경로: `competitions[]`의 `id`, `href`, `title`, `receiptStartAt`, `receiptEndAt`, `startAt`, `endAt`, `registrable`, `statusLabel`, `languages`. 항목 ID: `id`. 페이지네이션: `page=N`, 10건씩, `totalPages` 11. 조건부 요청: `etag: W/"…"`(304 시험 안 함)
- 내용: 10건 모두 `statusLabel: "ended"`. 가장 최근 접수 2025-01-20~02-05. 개발 3 / 비개발 7(채용 5, 교육생 모집 2)
- 약관: `https://school.programmers.co.kr/tos`(2026-05-16, 주소는 검색 근거). 주어는 "개인회원"이다
  - 제19조 ⑤ 10. "사이트의 콘텐츠, 정보, UI 등에 대한 무단 복제, 전송, 배포, 크롤링, 스크래핑 등의 행위" 제19조 ④ "… 정보를 "회사"의 사전동의 없이 … 이를 타인에게 제공할 수 없다."
- 미확인: 진행 중 대회만 거르는 파라미터, 304 여부

### Devpost

- 목록 URL: 화면 `https://devpost.com/hackathons`, 데이터 `https://devpost.com/api/hackathons`
- 읽기: 숨은 API. 페이지 설정값 `hackathon_search_api_url`에 주소가 있다. 인증 없이 JSON. robots `Disallow:`(빈 값). AWS WAF challenge 스크립트가 붙어 있다
  - 데이터 경로: `hackathons[]`의 `id`, `title`, `url`, `displayed_location.location`, `open_state`, `submission_period_dates`, `themes[].name`, `prize_amount`, `organization_name`, `featured`. 필터: `challenge_type[]`, `status[]`, `length[]`, `themes[]`, `open_to[]`, `organization`, `search`, `order_by`. 국가 필터는 없다. 페이지네이션: `page=N`, 9건씩. `etag` 있음
- 내용: `search=Korea&status[]=upcoming&status[]=open` 호출에 1건("KUK VIRTUAL HACKATHON", Online). 필터 없는 1페이지는 보지 않았다
- 약관: `https://info.devpost.com/legal/terms-of-service`(2025-12-05). 대상은 "All Users"다
  - "Uses manual or automated software, devices, scripts robots, or other means or processes to access, “scrape,” “crawl” or “spider” the Site, … or any related data or information;"
  - "Unauthorized copying or use of any Devpost Content … without the express written consent of Devpost is strictly prohibited."
- 미확인: `search`가 위치 문자열에 걸리는지, 한국 현장 행사 수, WAF가 반복 요청을 막는지

### HackQuest

- 목록 URL: `https://www.hackquest.io/ko/hackathons`, 지난 해커톤 `https://www.hackquest.io/ko/projects?view=hackathons`
- 읽기: 내장 데이터 + SSR(Next.js RSC). 응답까지 약 7초. robots는 `/api/`를 막는다
  - 데이터 경로: `self.__next_f.push` 안 `{"data":[…],"total":N}`. 필드 `id`, `alias`, `name`, `status`, `totalRewards`, `info.host`, `info.mode`, `timeline.timeZone`. HTML `a.group/hackathon-card[href^="/ko/hackathons/"] h2`. 항목 ID: `alias` 또는 `id`(UUID). 다음 페이지 URL은 확인 못 함. 조건부 요청: 없음
- 내용: "모든 해커톤" 0건(비로그인). 과거 해커톤 `total: 112`. 본 9건은 모두 웹3 해커톤이고 한국 개최 0건. 국가 칸이 없다
- 약관: `https://www.hackquest.io/terms-of-service`(2026-07-13). 회원 한정 문구는 없다
  - "Engaging in automated scraping, data mining, or sybil account creation to artificially inflate participation metrics or manipulate campaign outcomes." 끝 목적 구절이 셋 모두에 걸리는지 해석이 갈린다
- 미확인: 진행 중 해커톤 수, "HackQuest MCP"가 공식 데이터 경로인지. "KAIST HackQuest"는 무관한 행사다(검색 근거)

### NASA Space Apps Challenge

- URL: `https://www.spaceappschallenge.org`, 도시 목록 `https://www.spaceappschallenge.org/2026/local-events/`
- 읽기: 메인은 SSR. 도시 목록은 GraphQL `https://api.spaceappschallenge.org/graphql`(번들에 `query OpenLocations(...)`, 필드 `country`, `displayName`, `isVirtual`). `q:"Korea"` 1회 POST에 400 `"Event Parameter is required"`
- 최근 회차: 2026.11.14~15(전 세계 동시). 서울 행사 "2026 NASA International Space Apps Challenge Seoul"(검색 근거)
- 개최 주기: 연 1회. 메뉴에 2023·2024·2025 지난 회차가 있다
- 주소 규칙: `/{연도}/`(2024는 `/nasa-space-apps-2024/`). 도시 목록 `/{연도}/local-events/`. 새 회차 신호: 연도 경로. 조건부 요청 헤더 없음
- 공지 채널: 블로그 `https://www.spaceappschallenge.org/blog/`(RSS 미확인), SNS. 서울 공지는 대학 게시판(검색 근거)
- 약관: `https://www.spaceappschallenge.org/legal/`(2026-08-07)은 참가 등록자용이다. 사이트 이용 약관은 찾지 못했다
- 미확인: 2026 `event` ID(`filtering`에 `{field:"event", value:<행사 ID>, compare:"id"}` 필요), 블로그 RSS

## 4. 알고리즘 대회

### ICPC Korea

- URL: `https://icpckorea.org`, RSS `https://icpckorea.org/feed`
- 읽기: 공식 RSS. 메인도 정적 SSR이다. RSS 2.0 10건 `item > title, link, pubDate`. 메인 공지 `a[href^="/archives/"]`, ID `/archives/{숫자}`. robots 규칙 없음
- 최근 회차: 2026 ICPC Asia Seoul Regional. 예선 10.17, 본선 11.13~14 KINTEX. 10-22 본선 진출팀 공지
- 개최 주기: 매년. 6월 일정 공지 → 9월 예선 등록(2026 마감 9/22) → 10월 예선 → 11월 본선
- 주소 규칙: `/{연도}-{도시}/`. 2026은 `/2026-seoul/2026-regional/`, 2021~2025는 `/{연도}-seoul/regional/`. 아카이브 `https://icpckorea.org/history/`. 새 회차 신호: RSS 새 항목. 메인·RSS에 ETag·Last-Modified가 있다
- 공지 채널: RSS(robots 허용), ICPC Asia Blog `https://icpcasia.wp.txstate.edu/`
- 약관: 찾지 못함
- 미확인: RSS가 10건 고정인지, 영문 공지가 RSS에 들어가는지

### UCPC

- URL: `https://ucpc.me`, 회차 `https://2026.ucpc.me`
- 읽기: SSR(Jekyll). 공지는 "(M/D) 내용" 텍스트, 회차 링크 `a[href^="https://20"][href*=".ucpc.me"]`. robots는 Cloudflare 주석만 있고 규칙이 없다
- 최근 회차: UCPC 2026. 신청 6.5~6.22, 예선 6.27 온라인, 본선 7.12 카이스트. 종료
- 개최 주기: 매년 여름. 2025 본선 7.26. 2023년엔 겨울 대회 `2023w.ucpc.me`도 있었다. 첫 공지는 2월("(2/22) UCPC 2026이 개최됩니다!")
- 주소 규칙: `https://{연도}.ucpc.me`, 겨울 `https://{연도}w.ucpc.me`. 새 회차 신호: 메인의 새 연도 서브도메인 링크. `last-modified`만 있다
- 공지 채널: 메인·회차 사이트 공지, Facebook 그룹 `https://www.facebook.com/groups/ucpc.korea`. RSS 없음
- 약관: 찾지 못함
- 미확인: 2023 이후 겨울 대회, Cloudflare가 봇 UA를 계속 통과시키는지

### SCPC

- URL: `https://research.samsung.com/scpc`(삼성리서치). 이전 주소 `https://www.codeground.org/scpc/`는 지금도 500이다
- 읽기: SSR. 일정이 HTML 텍스트에 있다. codeground 공지는 `POST https://www.codeground.org/commu/commons/ajaxNoticeList`(본문 `draw=1&start=0&length=10&searchCondition=&searchConditionText=`, 헤더 `AJAX: true`, 인증 없음) → `data[].{uuid, commuTitle, firstRegDts, hit}`
- 최근 회차: 제12회 SCPC 2026. 접수 6.10~7.9(알고리즘), 6.11~7.5(AI). 본선 AI 8.21, 알고리즘 8.28. 종료
- 개최 주기: 매년 여름. 접수 공지 6월 초, Round 1 결과 7월, Round 2 결과 8월(codeground 공지)
- 주소 규칙: 현재 회차 `https://research.samsung.com/scpc`(고정), 지난 회차 `https://research.samsung.com/{연도}scpc`. 새 회차 신호: `/scpc` 본문의 회차·일정 문구. 조건부 요청 헤더 없음
- 공지 채널: 공식 페이지, codeground 공지, 삼성전자 뉴스룸(검색 근거). RSS 없음
- 약관: `https://research.samsung.com/terms`. 자동 수집 조항은 찾지 못했다. "… for any purpose other than for your personal, informational and non-commercial use as set forth herein."
- 미확인: `/scpc`가 새 연도로 바뀌는 시점, 삼성리서치 공지 RSS

### 한국정보올림피아드 (KOI)

- URL: `https://koi.or.kr`, Atom `https://koi.or.kr/feed.xml`
- 읽기: 공식 RSS(Atom). 메인도 SSR(Jekyll)이다. `entry > title, link[rel=alternate], published, updated`. 공지 URL `/notice/{YYYY}/{MM}/{DD}/{slug}.html`
- 최근 회차: 2026년도. 1차 5/10, 2차 7/18, 2차 결과 8/4. 마지막 공지 2026-08-18
- 개최 주기: 매년 1·2차. 4월 말 1차 안내 → 5월 1차 → 6월 말 2차 접수 → 7월 2차 → 8월 결과
- 주소 규칙: `/koi/{연도}/1/`, `/koi/{연도}/2/`. 결과 `https://results.koi.or.kr`. 아카이브 `https://koi.or.kr/archives/`. 새 회차 신호: Atom 새 항목(최신 10건, ETag 있음)
- 공지 채널: 공식 공지와 Atom(robots 허용)
- 약관: 찾지 못함. 대상은 초·중·고다
- 미확인: 다음 연도 첫 공지 시기

## 5. 보안 CTF·해킹대회

Codegate와 KISA는 다시 조사하지 않았다("읽을 수 없음" 장).

### CTFtime

- 목록 URL: HTML `https://ctftime.org/event/list/upcoming`, RSS `https://ctftime.org/event/list/upcoming/rss/`, API `https://ctftime.org/api/v1/events/?limit=100`
- 읽기: 공식 API·RSS. HTML도 SSR이다. robots `Crawl-delay: 10`. 10초 간격으로 6회 요청했다
  - API: `id`, `title`, `start`, `finish`, `format`, `onsite`, `location`, `restrictions`, `weight`, `organizers[]`, `url`, `prizes`. RSS: `item > title, guid, start_date, finish_date, location, onsite, organizers`. 항목 ID: API `id` = RSS `guid`의 `/event/{id}`. 페이지네이션: API `limit`·`start`·`finish`. 조건부 요청: 없음
  - 국가 칸이 없다. 팀 API `/api/v1/teams/{id}/`에 `"country"`가 있다(HITCON 8299 → `"TW"`)
- 내용: 예정 42건(HTML 40건). 모두 CTF이고 한국 대회는 0건이다. Codegate CTF 2026(event 3131, 3292)이 올라온 적이 있다(검색 근거)
- 약관: 이용약관 페이지는 찾지 못했다. robots `Content-signal: search=yes, ai-train=no, use=reference`
  - API 안내 `https://ctftime.org/api/`: "This API is provided for data analysis and mobile applications only." / "You can not use this API to run CTFtime clones"
- 미확인: 개인 알림 봇이 "CTFtime clones"에 해당하는지에 대한 운영자 해석

### CCE (사이버공격방어대회)

- URL: `https://cce.cstec.kr/`
- 읽기: CSR(Vite + React). 일정·역대 기록이 번들 `/assets/index-Cidhh3c6.js` 문자열에 있다(`{year:"2017",edition:"제1회",…}` 배열). `/robots.txt`는 첫 화면과 같은 HTML이라 규칙 0개로 판정했다
- 최근 회차: 2026 제10회. 신청 7.24~8.18, 예선 8.22 온라인, 본선 9.17 서울 COEX, 시상식 9.18. 주최 국가정보원. 종료
- 개최 주기: 연 1회(2017~2026). 예선 8월, 본선 9월. 2024년부터 Cyber Summit Korea와 함께 연다
- 주소 규칙: 같은 주소를 해마다 덮어쓴다. 2023년에는 `cce.sctec.kr`(검색 근거). 새 회차 신호: 첫 화면 `ETag`·`Last-Modified`(번들 이름이 바뀌면 바뀐다)
- 공지 채널: 공지 게시판·RSS 없음. 유튜브 `https://www.youtube.com/@CCE-2025`. 링커리어에 모집 공고(검색 근거)
- 약관: 없음. 개인정보처리방침 모달만 있다
- 미확인: 2027 공고 시점, 주최 측 공지 게시판

### 핵테온 세종

- URL: `https://hacktheon.org/` (연도 경로 `/y2026/`)
- 읽기: SSR(CodeIgniter). 공지 `/y2026/p6/c1/`의 `li > a.info` 안 `strong.title span`, `span.date`. 링크는 첨부 파일 `/lib/download?file={코드}`다. robots `Disallow:`(빈 값)
- 최근 회차: 2026.7.9~10 정부세종컨벤션센터. 종료. 예선 결과 공고 2026-04-27
- 개최 주기: 연 1회. 2023.5.11~12, 2024.6.17~21, 2025.7.10~11, 2026.7.9~10
- 주소 규칙: `/y{연도}/`. 루트는 그해 회차다. History `https://hacktheon.org/y2026/p1/c6/`, 지난 회차 `/y2025/`도 열린다. 새 회차 신호: `/y{연도}/` 등장, 루트 제목 변화. ETag·Last-Modified 없음
- 공지 채널: 공식 공지(2건). SNS는 첫 화면에서 찾지 못했다
- 약관: 없음. 개인정보처리방침 `/html/agree/`만 있다
- 미확인: 2027 공고 시점, `/y2027/`가 미리 열리는지

### KISIA

- URL: `https://www.kisia.or.kr/`
- 읽기: 불가(사이트 점검). `/`는 168바이트이고 본문은 `<img src='no.png'>` 하나다
  - 이미지 문구: "PHP2Shell 관련하여 긴급 점검을 진행함에 따라, 현재 사이트 접속이 어려운 점 양해 부탁드립니다." `/announcement/notice/`는 호스팅사(`gethompy.com`) 404 화면으로 302된다. robots `Allow: /`, `Disallow: /gmbbs`
- 최근 행사: 2026 KISIA CTF. 예선 8.9 온라인, 본선 8.18 코엑스 마곡(검색 근거). 2024·2025는 "KISIA 정보보호 개발자 해커톤"(검색 근거)
- 미확인: 복구 시점, 공지 게시판 경로, `/gmbbs`가 게시판 경로인지, 약관

### POC (Power of Community)

- URL: `https://powerofcommunity.net/`
- 읽기: SSR. 일정·장소·발표·등록 안내가 HTML에 있다. 등록 버튼 `a[href^="https://event.pocsec.com/event/"]`. robots.txt 404
- 최근 회차: POC2026 "November 12-13, 2026", "The Westin Seoul Parnas, Korea"(예정). "Registration opens on September 1."
- 개최 주기: 연 1회 11월 서울(2006~). POC2025는 2025.11.13~14
- 주소 규칙: `/`가 그해 회차. 지난 회차 `/archive/{연도}`(예 `https://powerofcommunity.net/archive/2025`). 등록 `event.pocsec.com/event/POC{연도}`. 새 회차 신호: 첫 화면 날짜 문자열. ETag·Last-Modified 없음
- 공지 채널: 공지 게시판·RSS 없음. X `https://x.com/POC_Crew`
- 약관: 없음. 푸터 "© 2006 - 2026 Powerofcommunity All Rights Reserved"
- 미확인: CFP 공지 시점, POC CTF가 CTFtime에 올라오는지

### 화이트햇 콘테스트

- URL: `https://whitehatcontest.kr/`
- 읽기: 불가(연결 실패). `/robots.txt` 재시도도 `curl: (35) LibreSSL/3.3.6: error:1404B42E:SSL routines:ST_CONNECT:tlsv1 alert protocol version`
- 행사: 국방부 주최·사이버작전사령부 주관, 2013년부터 매년(검색 근거). 콘테스트코리아·요즘것들·슥삭 목록에 "화이트햇 2026 국방 사이버보안 콘테스트"가 있다
- 미확인: 서버가 받는 TLS 버전, 2026 일정, 약관

## 6. 세미나·컨퍼런스·밋업 모음

온오프믹스, Festa, Dev-Event는 다시 조사하지 않았다("읽을 수 없음" 장).

### 이벤터스

- 목록 URL: 화면 `https://event-us.kr/search?category=IT%2F%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D`, 데이터 `POST https://api.event-us.kr/api/v1/engine/search`
- 읽기: 숨은 API. 화면 `eventList: []`가 비어 있고 `axios.post(engineApiBase + '/search', engineModel)`가 받는다. 인증 없음. API 호스트 robots.txt 404
  - 본문: `{"query":"","page":{"current":1,"size":30},"filters":{"all":[{"state":"Start"},{"disclosure_status":"open"},{"is_ignore":"false"},{"category":["IT/프로그래밍"]},{"register_due_date":{"from":"<지금 ISO>"}}]},"sort":[{"date":"desc"},{"id":"desc"}]}`
  - 데이터 경로: `results[]`의 `title.raw`, `id.raw`, `subdomain.raw`, `event_type.raw`, `start_date.raw`, `register_due_date.raw`, `payway.raw`, `area.raw`. 유형 필터 `{"event_type":["강연/세미나","대회/공모전",...]}`(호출 안 함). 항목 ID: `id.raw` + `subdomain.raw`. 페이지네이션: `page.current`, `meta.page.total_pages`. 조건부 요청: 없음
- 내용: 254건. 최신 30건 중 개발 6 / 비개발 16 / 애매 8. 비개발 16건 중 13건이 교육생 모집이고 `event_type`은 대부분 "강연/세미나"다. 화면에 광고 배너 4건이 따로 있다
- 약관: `https://event-us.kr/legal/service`(2024.04.02). 제2조 "“서비스 이용자”란 회원과 비회원을 말한다." 자동 수집 조항은 찾지 못했다
  - 제13조 "… 서비스를 이용하여 얻은 정보를 회사의 사전 승낙 없이 영리 또는 비영리의 목적으로 복제, 출판, 방송 등에 사용하거나 제3자에게 제공하는 행위"
- 미확인: 광고(`pitId`) 항목 조건, `event_type` 필터 응답

### Meetup (AWSKRUG)

- 목록 URL: `https://www.meetup.com/awskrug/events/`
- 읽기: 내장 데이터. `__NEXT_DATA__` → `props.pageProps.__APOLLO_STATE__`의 `Event:{id}`
  - 예정 행사: `Group:20402758`의 `events({"filter":{"afterDateTime":...},"first":30,"sort":"ASC"})` 연결 `edges[].node.__ref`. `totalCount` 7, `hasNextPage: false`
  - 항목 ID: `id`, `eventUrl`. 지난 행사 다음 쪽(`/gql*`)은 robots 금지. 조건부 요청: 약한 ETag, `If-None-Match`에 304. 같은 JSON에 참석자 회원 정보(`Rsvp:*`)가 있다
- 내용: 17건(예정 7, 지난 10) 모두 개발. 칸: 시작·종료 시각, 형식, 상태, 장소, 참가비, 참석 수, 정원
- 약관: `https://www.meetup.com/terms/`가 `help.meetup.com`으로 308되고, 그 주소가 Cloudflare 확인 화면(403)을 줘 원문을 받지 못했다
  - 검색 근거: "5.4 … (a) extract data from the Platform for a commercial purpose not permitted by these Terms"
- 미확인: 약관 원문, 다른 국내 그룹 구조

### Luma 서울

- 목록 URL: `https://luma.com/seoul`
- 읽기: 내장 데이터. `__NEXT_DATA__` → `props.pageProps.initialData`(`kind: "discover-place"`) → `data.events[]` 12건. robots에 `Googlebot` 그룹만 있다
  - 숨은 API `GET https://api.luma.com/discover/get-paginated-events?discover_place_api_id=discplace-eQieweHXBFCWbCj&pagination_limit=50`: 인증 없이 같은 12건, `has_more: false`. 주소는 검색 근거다
  - 데이터 경로: `data.events[].event.name`, `.event.url`, `.event.start_at`, `.event.geo_address_info`, `.calendar.name`, `.ticket_info.is_free`, `.guest_count`. 항목 ID: `event.api_id`. 페이지네이션·조건부 요청: 없음. 도시 페이지에 분류 필터가 없다
- 내용: 12건 중 개발 3 / 비개발 6 / 애매 3
- 약관: `https://luma.com/terms`(날짜 없음). "These Terms apply to all visitors, users and others who access or use the Service."
  - "… you must not access the Service by any means other than our publicly supported interfaces." "You may not reproduce, republish, distribute, … any Site Content without our express written permission, …"
- 미확인: 페이지 스크립트가 이 API를 부르는지, 서울+테크 조합 필터

### ticketa (티켓타코)

- 목록 URL: 화면 `https://ticketa.co`, 데이터 `GET https://vlizxsubseudvtswwsjd.supabase.co/functions/v1/events?locale=ko`
- 읽기: 숨은 API. 첫 화면 청크(`HomePageClient`)에 `apiClient.get("/events",{params:{locale:e}})`, 공용 청크에 `axios.create({baseURL:"https://vlizxsubseudvtswwsjd.supabase.co/functions/v1"})`. `Authorization`은 로그인 때만 붙는다. 헤더 없이 200
  - 데이터 경로: `events[]`의 `id`, `title`, `start_date`, `end_date`, `status`, `location_type`, `venues.{region, city, address, place_name}`, `organization_id`. 항목 ID: `id`(8자 slug) → `https://ticketa.co/event/{id}`. 페이지네이션: 없음(지난 행사 포함 134건). 조건부 요청: 없음. `https://ticketa.co/sitemap.xml`에 같은 134건과 `<lastmod>`
- 내용: 예정 22건 중 개발 12 / 비개발 4 / 애매 6. FECONF 2026, 드로이드나이츠 2026, WOOWACON 2026, DEVFEST INCHEON 2026 등. 지난 행사에 GopherCon Korea 2025, Let'Swift 2025, 스프링캠프 2026
- 약관: `https://ticketa.co/terms`(2026-10-01). 크롤링 조항은 찾지 못했다. 자동화 조항은 예매 한정이다(제6조)
  - 제17조 "회원은 회사의 사전 동의 없이 서비스의 콘텐츠를 복제, 배포, 전송, 수정하거나 상업적 목적으로 이용할 수 없습니다." 제2조는 비회원을 정의하지만 제17조에 비회원은 없다
- 미확인: 비로그인 호출 허용이 계속되는지, 주최 조직 이름 경로

### GDG 서울

- 목록 URL: `https://gdg.community.dev/gdg-seoul/`
- 읽기: 내장 데이터. `__NEXT_DATA__` → `props.pageProps.prerenderData.upcomingEvents`·`pastEvents`. robots `Crawl-delay: 2`
  - 데이터 경로: `upcomingEvents.results[]`의 `title`, `start_date`, `event_type_title`, `url`, `is_conference`. 항목 ID: `url` slug. 예정 행사는 `page_size: 500`. 지난 행사 다음 쪽(`/api/`)은 robots 금지. 강한 ETag(304 시험 안 함)
- 내용: 예정 0건. 지난 행사 누적 60건, 내장 4건 모두 개발. 지난 4건 간격 3~6개월
- 약관: `https://gdg.community.dev/participation-terms/`(2020-06-12)에는 자동 수집·재배포 조항이 없다
  - 바닥글이 링크한 Google 약관: "using automated means to access content from any of our services in violation of the machine-readable instructions on our web pages (for example, robots.txt files that disallow crawling, training, or other activities)". GDG 사이트 적용 여부는 명시가 없다
- 미확인: 예정 행사가 있을 때 데이터 모양, 다른 국내 챕터 목록 경로

### OKKY

- 목록 URL: IT 행사 `https://okky.kr/events/it`, 공모전·해커톤 `https://okky.kr/community/gathering-competition`
- 읽기: SSR. 같은 HTML의 RSC 조각(`self.__next_f`)에 Spring 페이지 JSON(`content[]`, `totalElements`)이 있다
  - 선택자: IT 행사 `a[href^="/articles/"]`(빈 이미지 링크 제외). 공모전·해커톤 `a[href$="?topic=gathering-competition"]`. 내장 JSON `content[].{id, title, dateCreated, viewCount, tags[].name}`. 항목 ID: `/articles/{id}`. 페이지네이션: `?page=N`(2페이지 확인), IT 행사 184쪽(3,662건). 조건부 요청: 없음
- 내용: IT 행사 20건 중 개발 8 / 비개발 7 / 애매 5. 공모전·해커톤 20건 중 개발 8 / 비개발 6 / 애매 6(팀원 모집 글). 행사 일시·장소 칸이 없다
- 약관: `https://okky.kr/legal/terms`(2024-01-10). 자동화 조항은 쓰기·변조만 다룬다
  - "⑥ OKKY의 동의 없이 자동화된 수단에 의해 OKKY에 게시물을 업로드하거나, … 수정・변조・삭제 등의 영향을 끼치는 행위는 금지됩니다."
  - 게시물 라이선스 "… 외부 사이트에서의 검색, 수집 및 링크 허용을 위해서만 제한적으로 행사할 것입니다."
- 미확인: 팀원 모집 글과 공고 글을 가르는 표시

### AWS 코리아 이벤트

- 목록 URL: 허브 `https://aws.amazon.com/ko/events/`, 카탈로그 `https://aws.amazon.com/ko/events/explore-aws-events/`
- 읽기: 허브는 SSR이다. 링크 약 14개는 행사 종류 카드다(Summit, re:Invent, Innovate 등). 한국 개별 행사는 없다
  - 카탈로그: `"directoryId":"alias#events-webinars-interactive-cards"` → `/api/dirs/items/search`(robots `Allow`). 위치 필터는 americas/apac/emea뿐이다. 1회 호출 `GET https://aws.amazon.com/api/dirs/items/search?item.directoryId=alias%23events-webinars-interactive-cards&item.locale=ko_KR&tags.id=GLOBAL%23local-tags-location%23apac&size=50` → 0건
- 내용: 개별 행사 0건
- 약관: `https://aws.amazon.com/terms/`. 방문자 전체 대상이다. 날짜 엇갈림: 이 파일은 "Last Updated: June 2, 2025", AWS Summit Seoul 파일은 "June 4, 2025"
  - "This license does not include … any use of data mining, robots, or similar data gathering and extraction tools."
  - "… may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without express written consent or license of AWS."
- 미확인: 디렉터리 API 파라미터 형식, 국내 행사가 카탈로그에 실리는지

### 요즘IT

- 목록 URL: `https://yozm.wishket.com/magazine/`, RSS `https://yozm.wishket.com/magazine/feed/`
- 읽기: 공식 RSS. 목록은 SSR이다. robots `Crawl-delay: 5`, `/magazine/` 허용
  - RSS `channel > item > title, link, guid, description, content:encoded`. `pubDate`·`category`가 없다. 최신 30건 고정(906KB). RSS에 `etag`, `last-modified`. 항목 ID: `/magazine/detail/{숫자}`. 분류 경로 `/magazine/list/{ai|develop|career|trend|...}/`. "행사" 분류는 찾지 못했다
- 내용: RSS 30건 중 행사 관련 글 1건(FECONF 2026 미리보기). "행사 모음" 기사는 반기에 1번 꼴이다(검색 근거, 예 `/magazine/detail/3923/`)
- 약관: `https://auth.wishket.com/terms/service`(2024-03-25, 위시켓 공통). 주어는 "회원"이다
  - 제10조 "프로젝트의 정보 및 파트너의 정보를 수집하기 위해 크롤링을 하는 행위"
  - "회원은 서비스를 이용하여 얻은 정보를 가공, 판매하는 행위 등 플랫폼에 게재된 컨텐츠를 상업적으로 사용할 수 없습니다."
- 미확인: 행사 모음 기사 태그 경로, RSS 항목 날짜

## 7. 네임드 컨퍼런스 공식 사이트

목록이 아니라 행사 하나의 페이지다. 기업 주최(if(kakao)~SK AI Summit)를 먼저, 커뮤니티 주최(FEConf~인프콘)를 뒤에 적는다.

### if(kakao)

- URL: `https://if.kakao.com/` → 307 → `/2026`
- 읽기: SSR(Nuxt). 일정·장소·신청 기간이 본문 텍스트에 있다. 회차 목록은 `/history`의 `a[href^="/20"]`
- 최근 회차: if(kakao)26, 2026.10.13~14 카카오 AI 캠퍼스. 종료. 신청 9.7~9.28, 무료
- 개최 주기: 매년. `/history`에 2018~2022, 2024, 2025(2023 없음). 2025는 9.23~25(검색 근거)
- 주소 규칙: `https://if.kakao.com/{YYYY}`. 루트가 최신 연도로 307된다. 새 회차 신호: 루트 307 대상, RSS 제목의 "if(kakao)". ETag·Last-Modified 없음
- 공지 채널: tech.kakao.com RSS `https://tech.kakao.com/feed`(robots 허용). 10건 중 if(kakao)26 글 5건. 예고 8/31(약 6주 전), 개최 공지 9/7(약 5주 전)
- 약관: if.kakao.com에 약관 링크가 없다. tech.kakao.com 푸터 `https://www.kakao.com/policy/oppolicy?lang=ko`는 `www.kakao.com/robots.txt`가 `Disallow: /`라 받지 않았다
- 미확인: 카카오 약관 원문, 2023 미개최 사유

### DEVIEW

- URL: `https://deview.kr/`(= `https://deview.naver.com/`, 바이트 동일)
- 읽기: SSR. 첫 화면이 "DEVIEW ARCHIVE"다. 연도 링크 `a[href^="https://deview.naver.com/20"]`. robots.txt 404
- 최근 회차: DEVIEW 2023(2023.2.27~28). 그 뒤 단독 회차는 없다
- 개최 주기: 2009~2021 매년, 2022 없음, 2023. 2024부터 DAN에 기술 세션으로 통합됐다(검색 근거: metroseoul 2024-10-23)
- 주소 규칙: `https://deview.naver.com/{YYYY}`. 새 회차 신호: 아카이브 연도 링크. ETag·Last-Modified 있음
- 공지 채널: NAVER D2 Atom `https://d2.naver.com/d2.atom`(20건 중 DEVIEW·DAN 글 0건)
- 약관: 네이버 공통 `https://policy.naver.com/rules/service.html`(2026-10-01)
  - "네이버의 사전 허락 없이 자동화된 수단(예: 매크로 프로그램, 로봇(봇), 스파이더, 스크래퍼 등)을 이용하여 … 이용자(사람)의 실제 이용을 전제로 하는 네이버 서비스의 제공 취지에 부합하지 않는 방식으로 네이버 서비스를 이용하거나 … 시도해서는 안 됩니다."
  - "네이버 서비스 또는 이에 포함된 소프트웨어를 복사, 수정할 수 없으며, … 타인에게 그 이용을 허락해서는 안 됩니다."
- 미확인: 2022 결측 사유, 네이버 "검색결과 수집에 대한 정책" 내용

### DAN (팀네이버 컨퍼런스)

- URL: `https://dan.naver.com/` → 302 → `http://dan.naver.com/25`
- 읽기: CSR. `/25`는 빈 `<div id="wrap">`과 `/2025/js/2025_main.bundle.js`뿐이다. `<title>DAN25 | TEAM NAVER CONFERENCE</title>`. `/26`은 404. robots 전체 허용
- 최근 회차: DAN25, 2025.11.6~7 코엑스(검색 근거). 2026 회차는 사이트·검색·D2 Atom에서 찾지 못했다
- 개최 주기: DAN24(2024년 11월) → DAN25. 첫 보도는 DAN25 2025-09-30(약 5주 전), DAN24 2024-10-23(약 3주 전)(검색 근거)
- 주소 규칙: `https://dan.naver.com/{YY}`. 정적 파일은 `/{YYYY}/` 아래다. 새 회차 신호: 루트 302 `Location`(`/25`). ETag·Last-Modified 없음
- 공지 채널: D2 Atom, navercorp.com 보도자료(검색 근거)
- 약관: 네이버 공통 약관(DEVIEW 항목)
- 미확인: DAN26 개최 여부, 지난 회차 아카이브 경로

### 우아콘 (WOOWACON)

- URL: `https://woowacon.com/`
- 읽기: CSR. HTML에는 `<title>WOOWACON 2026 | 우아콘 2026</title>`과 og 태그만 있다. 일정은 번들 `/assets/index-DaIzrxzf.js` 상수 `{applyOpenAt, applyCloseAt, resultAt, eventStartAt, eventClosedAt, videoOpenAt}`. API 호스트 `woowacon-api.woowacon.com`은 robots.txt가 403이라 호출하지 않았다
- 최근 회차: 2026-10-28(수) 10:00~18:00 하루, 그랜드인터컨티넨탈 서울 파르나스. 신청 9.22~10.13. 근거: 번들 `eventStartAt 2026-10-28T10:00`, `eventClosedAt 2026-10-29T00:00`, 기술 블로그 RSS 본문 "일시: 2026년 10월 28일(수) 10:00~18:00"
- 개최 주기: 매년(아카이브 2020~2025). 2025는 2025-10-28(검색 근거)
- 주소 규칙: 같은 주소. 지난 회차는 `/archive`(CSR). 새 회차 신호: `<title>` 연도. 메인 HTML에 ETag·Last-Modified
- 공지 채널: 기술 블로그 RSS `https://techblog.woowahan.com/feed/`, 카테고리 RSS `https://techblog.woowahan.com/category/우아콘/feed/`(robots 허용, ETag 있음). 2026 공지 9/23(5주 전). 2025는 블로그 사전 공지가 없었다
- 약관: 없음(`/action-guide`, `/privacy-policy`만)
- 미확인: 우아한형제들 공통 약관

### SLASH (토스)

- URL: `https://toss.im/slash-24`
- 읽기: SSR(Next.js). 세션 링크 `a[href^="/slash-24/sessions/"]`. robots는 `/slash-*`를 막지 않는다
- 최근 회차: SLASH24, 2024-09-12 코엑스(검색 근거)
- 개최 주기: 2021~2024 매년(21~23 온라인 6월, 24 오프라인 9월, 검색 근거). 2025 이후 근거를 찾지 못했다(`slash-25`·`slash-26` 404, 검색 3회, RSS 2곳). 지난 회차 공지는 행사 2~2.5주 전이었다
- 주소 규칙: `https://toss.im/slash-{YY}`. 새 회차 신호: `slash-{YY}` 새 경로. `slash-24`는 `last-modified: Thu, 10 Oct 2024 01:50:54 GMT` 그대로다
- 공지 채널: toss.tech RSS `https://toss.tech/rss.xml`, 토스피드 RSS `https://toss.im/tossfeed/rss.xml`(둘 다 20건 중 SLASH 글 0건)
- 약관: `https://toss.im/docs/11027`(2026-06-17, 토스앱 회원 대상 전자금융 약관). 크롤링 명시 조항은 없다. 제26조 ② "회원은 … 얻은 정보를 가공, 제공, 판매하는 등 영리 목적으로 이용하거나 제3자에게 이용하게 할 수 없습니다."
- 미확인: 2025 미개최 사유

### NDC (넥슨)

- URL: `https://ndc.nexon.com/`
- 읽기: CSR(Vite + React). HTML에는 제목, og 이미지 `NDC_26_OpenGraph.png`, 설명 "… NDC26에서…"만 있다. 일정은 번들 `date:"2026.06.16(Tue) - 06.18(Thu)"`. 번들에 `baseURL:"https://ndc.nexon.com/api/v1"`(호출 안 함)
- 최근 회차: NDC26, 2026-06-16~18, 넥슨 판교 사옥 + 경기창조경제혁신센터(검색 근거). 종료
- 개최 주기: 매년 상반기(2007~). NDC23·24는 비공개 사내 행사였다(번들 문구). 공지는 NDC26 보도 2026-05-11(약 5주 전)(검색 근거)
- 주소 규칙: 같은 주소. 회차는 og:image 파일명과 메타 설명 `NDC{YY}`로만 구분된다. 새 회차 신호: `last-modified`(2026-06-18 이후 그대로), `etag`, 메타 설명의 `NDC{YY}`
- 공지 채널: 보도자료, YouTube. 기술 블로그는 찾지 못했다
- 약관: 넥슨 통합 약관 `https://m.nexon.com/terms/535`(주소는 검색 근거). 크롤링 명시 조항은 없다. 제11조 ① "4. … 이를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복제, 유통하거나 상업적으로 이용하는 행위"(회원)
- 미확인: `/api/v1` 구성, 아카이브 경로

### AWS Summit Seoul

- URL: `https://aws.amazon.com/ko/events/summits/seoul/`
- 읽기: SSR. 본문에 "AWS Summit Seoul 2026", "세부 일정 2026년 5월 20-21일", 종료 안내가 있다. robots `*` 그룹 허용
- 최근 회차: 2026-05-20~21 코엑스. 종료, 온디맨드 제공
- 개최 주기: 매년 5월(검색 근거)
- 주소 규칙: 연도 없이 같은 경로. 새 회차 신호: `<title>` 연도와 일정 문구. `Last-Modified`는 공통 배너 때문에 행사 뒤에도 바뀐다
- 공지 채널: AWS 한국 블로그 RSS `https://aws.amazon.com/ko/blogs/korea/feed/`(robots 허용, 10건 중 행사 글 0건)
- 약관: `https://aws.amazon.com/terms/`. 조항은 AWS 코리아 이벤트 항목과 같다. 날짜 엇갈림: 이 파일은 "Last Updated: June 4, 2025", AWS 코리아 이벤트 파일은 "June 2, 2025"
- 미확인: 첫 공지·등록 오픈 시점, 아카이브

### AI Summit Seoul & Expo

- URL: `https://www.aisummit.co.kr/`
- 읽기: SSR(Squarespace). 본문 "2027.8.11(수) - 8.13(금) 코엑스 그랜드볼룸 & Expo B홀". `<title>`은 아직 "AI Summit Seoul & Expo 2026"이다
- 최근 회차: 2026-08-19~21 코엑스(검색 근거). 다음 회차 2027-08-11~13이 본문에 있다
- 개최 주기: 매년. 문구 "2018년 이래로 매년 서울에서 개최". 서울시 "AI SEOUL 2026", 한독상공회의소 "AI Summit Seoul 2026"은 다른 행사다(검색 근거)
- 주소 규칙: 같은 주소. 하위 `/expo-visitor-2027`처럼 연도 접미사가 붙는다. 새 회차 신호: 히어로 날짜 문구. 약한 ETag만 있다
- 공지 채널: 메인 히어로, 뉴스레터, 보도(검색 근거). 블로그·RSS 없음
- 약관: 이용약관 링크 없음. 푸터 "Any unauthorized reproduction of the logo or the name or the contents of this website is forbidden."
- 미확인: 2025 이전 회차 시기

### AI EXPO KOREA

- URL: `https://aiexpo.co.kr/`, 공지 `https://aiexpo.co.kr/공지사항/`
- 읽기: SSR(WordPress). 공지 `a.efp-bv-newsrow`, 날짜 `.efp-bv-newsdate b`, 제목 `.efp-bv-newsrow-title`, ID `?notice={n}`. `/feed/`는 302이고 항목 0건이다
- 최근 회차: 제9회, 2026-05-06~08 코엑스 A홀. 주최·주관 (사)한국인공지능협회, ㈜서울메쎄, 인공지능신문
- 개최 주기: 매년 4~5월 3일간(2022~2026). 2027 제10회 예정(날짜 없음)
- 주소 규칙: 같은 주소. 연도 페이지는 슬러그에 연도(`/ai-tech-2026/`). 아카이브 `https://aiexpo.co.kr/연도별-개최결과/`. 새 회차 신호: 공지 목록 새 항목
- 공지 채널: 공식 공지 목록. 출품사 조기 신청은 약 9개월 전(2026-08-05), 참관객 컨퍼런스 신청은 4~6주 전
- 약관: 이용약관 링크 없음. 개인정보처리방침 PDF만 있다
- 미확인: 2027 날짜, 공지 2페이지 URL, `sitemap.rss`

### KGC (한국게임개발자컨퍼런스)

- URL: `https://kgc.or.kr/`(`www` 포함 둘 다)
- 읽기: 불가. `curl: (60) SSL: no alternative certificate subject name matches target host name 'kgc.or.kr'`. 인증서 검사를 끄지 않았다
- 행사: 검색 2회에서 2025·2026 회차를 찾지 못했다. 옛 회차(2005, 2010, 2012)만 나온다(검색 근거). KGDCon(한국인디게임협회)은 다른 행사다
- 미확인: 현재 공식 주소, 최근 회차, 약관

### SK AI Summit

- URL: `https://www.skaisummit.com/`
- 읽기: 불가. `curl: (28) Connection timed out after 15006 milliseconds`(재시도). 이전 조사도 시간 초과였다
- 행사(검색 근거): 2025.11.3~4 코엑스. 2024·2025 모두 11월 초. 2025 첫 보도 2025-10-12(약 3주 전). 2026 회차는 찾지 못했다
- 미확인: 공식 주소, 2026 개최 여부, 약관

### FEConf

- URL: `https://2026.feconf.kr/`
- 읽기: SSR(Next.js 정적 내보내기, GitHub Pages). "FECONF BY FEDG. 2026.10.24 SAT. 10:00 OPEN. LOTTE TOWER 31F SEOUL, KOREA", 세션표, `a[href^="https://ticketa.co/event/"]`. 루트 `feconf.kr`은 meta refresh가 `https://2025.feconf.kr/`, canonical과 `location.replace`가 `https://2026.feconf.kr/`를 가리킨다
- 최근 회차: FEConf 2026, 2026.10.24(토) 롯데월드타워 31층(예정). 티켓 `https://ticketa.co/event/t12vlmil`
- 개최 주기: 연 1회. 2022.10.8 / 2023.10.21 / 2024.8.24 / 2025.8.23 / 2026.10.24
- 주소 규칙: `https://{YYYY}.feconf.kr`. 저장소 `github.com/fedgkr/feconf{YYYY}`. 지난 연도 서브도메인이 살아 있다. 새 회차 신호: GitHub `fedgkr/feconf{YYYY}` 저장소 생성(2026: 06-16, 2025: 05-11, 공개 API `api.github.com/orgs/fedgkr/repos`). `ETag`에 304 확인
- 공지 채널: 연도 사이트, LinkedIn·Facebook, GeekNews(검색 근거). 블로그·RSS 없음
- 약관: 없음. 저장소 `feconf2021`~`feconf2024` MIT, `feconf2025`·`feconf2026` 라이선스 없음
- 미확인: CFP 첫 게시 채널

### PyCon Korea

- URL: `https://2026.pycon.kr/`(루트 `pycon.kr`이 302)
- 읽기: CSR(Vite + React). HTML에 `<title>PyCon Korea 2026</title>`만 있다. 일정은 번들 상수 `DAYS=["2026-08-15","2026-08-16"]`. CMS API `https://rest-api.pycon.kr` `GET v1/cms/sitemap/` 1회에 404 `"frontend 도메인을 결정할 수 없습니다."`
- 최근 회차: 2026.8.15~16 동국대 서울캠퍼스. 종료
- 개최 주기: 연 1회(2024·2025·2026 서브도메인 응답)
- 주소 규칙: `https://{YYYY}.pycon.kr`. 루트가 그해 서브도메인으로 302된다. 새 회차 신호: `2027.pycon.kr` 등장, 루트 302 대상. `Last-Modified`만 있다
- 공지 채널: 블로그 Atom `http://blog.pycon.kr/feed.xml`(10건, 최근 2026-08-29, CFP·티켓 공지 없음), SNS, GitHub `pythonkr`
- 약관: 찾지 못함. robots `Content-Signal: search=yes,ai-train=no,use=reference`, 본문 "As a condition of accessing this website, you agree to abide by the following content signals"
- 미확인: CMS API 조건(Origin 헤더 추정), 2027 공지 시점

### 드로이드나이츠

- URL: `https://droidknights.dev/`
- 읽기: SSR(Next.js). "2026년 11월 2일", "과학기술컨벤션센터(ST Center)", 세션 12개, 티켓 `https://ticketa.co/event/2o8rdpls`. 날짜 `img[alt="날짜"] + span`. `/robots.txt`는 메인과 같은 HTML이라 규칙 없음으로 판정했다
- 최근 회차: 드로이드나이츠 2026, 2026.11.2(예정). 참가 지원 마감 2026.10.12
- 개최 주기: 연 1회. 2024.6.11, 2025.6.17, 2026.11.2
- 주소 규칙: 2024년부터 같은 주소. 2023년 이전은 `droidknights.github.io/{연도}/`. 새 회차 신호: `<title>`의 연도와 날짜 문구. 조건부 요청 불가(`no-store`)
- 공지 채널: GitHub `droidknights/DroidKnights-WebSite`(2026-10-14 갱신), Facebook·Instagram·YouTube. 블로그·RSS 없음
- 약관: 없음. 저장소 라이선스 없음
- 미확인: CFP 첫 공지 채널

### let'swift

- URL: `https://letswift.kr/2026/`(루트는 749바이트 연결용 페이지)
- 읽기: SSR(SvelteKit 사전 렌더링). 루트에 `<meta http-equiv="refresh" content="0; url=/2026/">`, `<link rel="canonical" href="/2026/">`. iCalendar `https://letswift.kr/2026/letswift-2026.ics`(`DTSTART:20261008T100000Z`, `UID:letswift-2026@letswift.kr`). `/2025/`, `/20260401/`은 Vite CSR이다
- 최근 회차: Let'Swift 2026 "개발 환경의 변화 — 워크숍", 2026.10.08 19:00~22:00 강남 코드스쿼드. 종료
- 개최 주기: 연 1회(2016~2025, 2021 없음, 주로 11월). 2026은 4.1(10 Years)과 10.8(워크숍)
- 주소 규칙: `/{YYYY}/`, 특별 회차 `/{YYYYMMDD}/`. 루트가 현재 회차로 연결된다. 새 회차 신호: 루트 canonical 경로, `.ics`. ETag·Last-Modified 있음(GitHub Pages)
- 공지 채널: GitHub `letswiftconf/letswift.kr`, 뉴스레터 저장소, iOS 앱, SNS. 블로그·RSS 없음
- 약관: 없음
- 미확인: `/20260401/` 성격, 2027 공지 시점

### GopherCon Korea

- URL: `https://gophercon.kr/`
- 읽기: CSR(CRA). HTML에 `<title>GopherCon Korea 2025</title>`만 있다. 번들에 `date:"2025. 11. 09. (SUN)", venue:"COEX Magok, 4F, Le West Hall B"`. "2026" 문자열은 없다
- 최근 회차: 2025.11.9 코엑스 마곡. 2026은 확인되지 않았다(Go 위키 Conferences에도 없음, 검색 근거). 저장소 마지막 push 2025-11-09
- 개최 주기: 연 1회. 2023.8.5~6, 2024.10.12, 2025.11.9(검색 근거)
- 주소 규칙: 같은 주소(저장소 `golangkorea/gophercon-korea-web`). 새 회차 신호: `<title>` 연도. ETag·Last-Modified는 재배포 시각이다(10-15 갱신 뒤에도 제목은 2025)
- 공지 채널: GDG Golang Korea 챕터 페이지(검색 근거), Go 위키 `Conferences.md`, SNS
- 약관: 사이트 약관 없음. 번들의 "후원 약관"은 후원사 대상이다
- 미확인: 2026 계획

### JSConf Korea

- URL: `https://jsconf.kr/` → 302 → `https://2022.jsconf.kr/`
- 읽기: SSR(Next.js). "JSConf Korea 2022", "2022년 9월 16일(금)~17일(토)". `*.jsconf.kr` 와일드카드 DNS가 Vercel을 가리키고, `2023`·`2024.jsconf.kr`은 TLS 실패다
- 최근 회차: 2022.9.16~17 노들섬. 저장소 archived(마지막 push 2022-11-13). 검색으로 2023~2026 공지를 찾지 못했다
- 개최 주기: 2019, 2020, 2022
- 주소 규칙: `https://{YYYY}.jsconf.kr`(2019는 `2019.jsconfkorea.com`). 새 회차 신호: 루트 302 `Location`. `ETag` 있음, `Last-Modified`는 요청 시각
- 공지 채널: SNS, 이벤터스 주최자 페이지(2019, 검색 근거)
- 약관: 없음. 저장소 `2022.jsconf.kr` MIT
- 미확인: 공식 중단 공지

### 인프콘

- URL: `https://infcon.day/` → 301 → `https://www.inflearn.com/conf/infcon-2024`
- 읽기: SSR(Gatsby). "2024. 8. 2", `og:title="인프콘 2024 - INFCON 2024"`. `/conf/infcon-2025`·`/conf/infcon-2026`은 404다. inflearn robots는 `/conf/`를 허용한다
- 최근 회차: 인프콘 2024, 2024.8.2 코엑스
- 개최 주기: 2022.8.26 / 2023.8.15 / 2024.8.2. 2025는 "인프콘 2025 쉬어갑니다!"(`https://www.inflearn.com/pages/notice-20250618-infcon`, 검색 근거). 2026 공지는 없다
- 주소 규칙: `https://www.inflearn.com/conf/infcon-{YYYY}`. 새 회차 신호: `infcon.day` 301 `Location`
- 공지 채널: 인프런 `pages`, X `@InflearnConf`(검색 근거)
- 약관: `https://www.inflearn.com/policy/terms-of-service`. HTML에 본문이 없다(본문은 `/api`, robots 금지)
- 미확인: 약관 본문, 휴식 공지 날짜(엇갈림: URL은 20250618, 검색 요약은 6월 30일)

## 8. 공공기관

오픈소스 포털은 운영 중이다([SOURCES.md](SOURCES.md)). IITP와 한국데이터산업진흥원은 다시 조사하지 않았다.

### NIPA

- 목록 URL: 사업공고 `https://www.nipa.kr/home/2-2`, 공지 `https://www.nipa.kr/home/2-1`
- 읽기: SSR. robots에 `Googlebot` 그룹만 있다
  - 선택자: `table.tbgg tbody tr td.tl div.co a`, 사업명 `span.box.bluebox`, 신청기간 `span.bco`, D-day `div.point b`. 항목 ID: `/home/2-2/{숫자}`. 페이지네이션: `?curPage=N`(35쪽). 조건부 요청: 없음
- 내용: 사업공고 10건 중 개발 0 / 비개발 8 / 애매 2(기업 대상 전시 참가 모집). 공지 13건 중 개발 0 / 애매 4
- 약관: `https://www.nipa.kr/home/6-1`. "이용자"(이용자번호를 받은 사람) 기준이다. 자동 수집 조항은 찾지 못했다. 오픈소스 포털 제15조와 문구가 같다
  - 제15조 "② 서비스를 이용하여 얻은 정보를 정보통신산업진흥원의 사전승낙 없이 이용자의 이용 이외의 목적으로 복제하거나 … 제3자에게 제공하는 행위"
- 미확인: 2페이지 이후 비율, 저작권 정책 페이지

### NIA

- 목록 URL: `https://www.nia.or.kr/site/nia_kor/ex/bbs/List.do?cbIdx=99835`
- 읽기: SSR. robots `*` `Allow: /`(Googlebot 그룹은 게시판 전체 금지)
  - 선택자: `div.board_type01 ul li a[onclick^="doBbsFView"]`, 제목 `span.subject`, 고정 `li.nia_noti`. 항목 ID: `doBbsFView('99835','{bcIdx}','16010100','{bcIdx}')`의 두 번째 값. 페이지네이션: GET `&pageIndex=N` 동작(197쪽). 조건부 요청: 없음
- 내용: 1페이지 10건(고정 3) 중 개발 0 / 비개발 6 / 애매 1. 2페이지 10건 중 개발 3
- 약관: 이용약관은 없다. 저작권 정책 `https://www.nia.or.kr/site/nia_kor/06/10603000000002016092303.jsp`가 "개인 또는 법인"을 대상으로 적는다
  - "… 컨텐츠를 링크하거나 인용, 복제 및 재배포 등을 통하여 사용하실 때 … 사전에 협의를 하고 허락을 얻고" "… 세부화면(서브도메인)으로 링크시키거나 페이지를 프레임 안에 넣는 것은 허용되지 않습니다."
- 미확인: 제목·링크 알림이 "링크·인용"에 해당하는지에 대한 기관 해석

### 한국콘텐츠진흥원

- 목록 URL(요청 안 함): 지원사업 `https://www.kocca.kr/kocca/pims/list.do?menuNo=204104`, 공지 `https://www.kocca.kr/kocca/bbs/list/B0000137.do?menuNo=204802`, 행사소식 `https://www.kocca.kr/kocca/bbs/list/B0000204.do?categorys=3&subcate=121&cateCode=0&menuNo=204894` 등 5곳
- 읽기: 불가(robots). `Disallow:/kocca/*/list.do`, `Disallow:/kocca/bbs/list/*.do`. 첫 화면 `/kocca/main.do`만 허용된다
  - 첫 화면 SSR: 지원사업 `div#main_board_list > a.list`, 제목 `div.title`, 접수기간 `div.day span`(HTML 주석 속 2021년 항목 3건 제외). 공지 `a[href*="/kocca/bbs/view/B0000137/"][href*="noticevent=Y"]`
- 내용(첫 화면): 지원사업 6 + 공지 4. 개발 0 / 비개발 6 / 애매 4(게임 기업 지원·입주 모집)
- 약관: 이용약관 `https://www.kocca.kr/kocca/subPage.do?menuNo=204913`(회원 기준), 저작권정책 `https://www.kocca.kr/kocca/subPage.do?menuNo=204916`. 자동 수집 조항은 찾지 못했다
  - 저작권정책: 공공누리 부착물은 유형별 조건으로 자유이용한다. "공공누리가 부착되지 않은 자료들을 이용하고자 할 경우에는 공공저작물 관리책임관 및 실무담당자와 사전에 협의하여 이용해 주시기 바랍니다."
- 미확인: 행사소식 게시판 비율, 공고별 공공누리 유형

### AI·SW중심대학협의회

- 목록 URL: 공지 `https://www.swuniv.kr/38`, 대학별 행사 `https://www.swuniv.kr/UniversityEvents`, 디지털경진대회 `https://www.swuniv.kr/60`
- 읽기: SSR(아임웹 게시판). robots `Allow: /`, `/?mode*` 등 금지
  - 선택자: 행 `ul.li_body`(고정 `ul.li_body.notice_body`), 제목 `a.list_text_title > span`, 분류 `li.category em`, 작성자 `li.name`, 날짜 `li.time[title]`. 항목 ID: 쿼리 `idx={숫자}`(`q`는 뺀다). 페이지네이션: `/38/?q=...&page=N`. 조건부 요청: 없음
- 내용: 공지 16건(고정 6) 중 개발 3 / 비개발 5 / 애매 2. 일반 10건은 모두 "타기관 홍보"다. 최신 글 2026-08-27. 대학별 행사 10건 중 개발 1. 디지털경진대회 고정 11건은 해마다 여는 협의회 대회 안내다(2026 안내 글 2026-04-06)
- 약관: `https://swuniv.kr/?mode=policy`는 robots가 `/?mode*`를 막아 받지 않았다
- 미확인: 이용약관 내용, 월별일정 게시판 구조

### K-Startup

- API 안내: `https://www.data.go.kr/data/15125364/openapi.do`. 주소 `https://apis.data.go.kr/B552735/kisedKstartupService01/getAnnouncementInformation01`(serviceKey 필요, 호출 안 함)
- 읽기: 공식 API(인증키). Swagger에 4개 기능: `getAnnouncementInformation01`, `getBusinessInformation01`, `getContentInformation01`, `getStatisticalInformation01`
  - 데이터 경로: `data.data[]`의 `biz_pbanc_nm`, `supt_biz_clsfc`, `pbanc_rcpt_bgng_dt`·`pbanc_rcpt_end_dt`, `rcrt_prgs_yn`, `aply_trgt`, `biz_aply_url` 등 29개. 항목 ID `pbanc_sn`. 페이지네이션 `page`, `perPage`. 필터 `cond[biz_pbanc_nm::LIKE]`, `cond[supt_biz_clsfc::LIKE]`, `cond[rcrt_prgs_yn::EQ]`, `cond[pbanc_rcpt_end_dt::LTE]`. 무료, 자동승인, 개발계정 10,000, `isCorpApi = "N"`(개인회원 신청 가능)
- 내용: 호출하지 않아 미확인. 개발 행사만 고르는 분류값은 명세에 없다. 목록 페이지는 robots 금지다("읽을 수 없음" 장)
- 약관: 안내 페이지 "이용허락범위 제한 없음". 공공누리 마크는 없다. 포털 약관 제15조 3항(공공데이터포털 항목)은 포털 서비스 대상이다
- 미확인: 실제 건수·비율, `supt_biz_clsfc` 값 목록, "제한 없음"과 공공누리 제0유형의 관계

## AI 추출과 AI 봇 규칙

AI 추출이 다루는 해석 문제가 확인된 곳:

- **목록 구조가 없다**: 7장 단일 행사 사이트. 해마다 주소나 구조가 바뀐다(let'swift는 연도마다 프레임워크가 다르다)
- **행사 외 글이 많이 섞인다**:
  - 공공기관 공지: NIPA, NIA, 공공데이터포털, AI Hub, AI·SW중심대학협의회 (운영 공지, 결과 발표, 모집)
  - 교육생 모집·채용: 이벤터스, 씽유, 슥삭, OKKY, 프로그래머스
  - 공모전 모음: 링커리어, 캠퍼스픽, 콘테스트코리아, 대티즌 (개발 무관 공모전)

외부 AI 에이전트가 직접 읽으면 그 에이전트의 UA에 대한 규칙이 따로 적용된다.

| 사이트 | AI 봇 규칙 |
| --- | --- |
| 요즘것들 | GPTBot, ClaudeBot, anthropic-ai, Claude-Web, Google-Extended, CCBot, Bytespider 등 30종 `Disallow: /`. PerplexityBot은 목록에 없다 |
| PyCon Korea | 학습 크롤러 30여 종(ClaudeBot, anthropic-ai, Claude-Web, GPTBot, CCBot, Google-Extended, Applebot-Extended, Bytespider, meta-externalagent, GoogleOther 등) `Disallow: /`. Claude-User·ChatGPT-User는 목록에 없다. `Content-Signal: search=yes,ai-train=no,use=reference` |
| AI Summit Seoul & Expo | AI 봇 약 30종을 `*`와 한 그룹으로 묶어 같은 규칙 적용(Squarespace 기본형) |
| 온오프믹스 | `*`는 전체 금지다. Claude-User, Claude-SearchBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, Perplexity-User는 `Allow: /`. 학습 크롤러(ClaudeBot, GPTBot, CCBot, Google-Extended, Applebot-Extended)는 `Disallow: /` (2026-10-22 기록) |
| Festa | AI 봇을 `*`와 한 그룹으로 묶어 전체 금지 (2026-10-22 기록) |
| 씽유 | `*` 그룹이 없다. 지정 봇(Googlebot·Yeti·bingbot·OAI-SearchBot·PerplexityBot 등)만 허용, GPTBot 금지. 목록에 없는 UA에는 규칙이 없다 |
| Meetup | GPTBot `Disallow: /` |
| GDG | AI 봇 전용 그룹(GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, Claude-Web, PerplexityBot, Google-Extended, FacebookBot 등). 내용은 `*`와 같다 |
| OKKY | GPTBot, ClaudeBot, Claude-User, PerplexityBot, OAI-SearchBot 그룹. 내용은 `*`와 같다. Bytespider·MJ12bot 등 16종은 전체 금지 |
| Devpost | Bytespider 등 5종만 `Disallow: /`. GPTBot·ClaudeBot 규칙 없음 |
| CTFtime | `Content-signal: search=yes, ai-train=no, use=reference` |
| UCPC | Cloudflare 콘텐츠 신호 안내 주석만 있고 신호 값이 없다 |
| 그 외 확인한 곳 | AI 봇 전용 규칙 없음 |

Claude-User, ChatGPT-User, Perplexity-User는 각 회사가 "사용자가 직접 요청한 접속"에 쓰는 이름이다. 예약 실행이 이 용도에 들어가는지는 확인하지 않았다. 약관은 robots.txt와 별개로 적용된다.

## 읽을 수 없음·해당 없음·제외

접근 정책 불가:

- 온오프믹스: `*` 전체 금지. 사용자 요청용 AI UA만 허용 (2026-10-22 기록)
- Festa: 전체 금지. 첫 화면이 "Coming Soon"이다 (2026-10-22 기록)
- IITP: `*` `Disallow:/` (2026-10-22 기록)
- 한국데이터산업진흥원: `*` `Disallow: /`. 홈 한 장(`/$`)과 `/datahub/portal$`만 허용 (2026-10-22 기록)
- K-Startup 목록 페이지: robots.txt가 `/bizpbanc-ongoing.do`, `/bizpbanc-deadline.do`를 막는다 (2026-10-22 기록)
  - 실제 경로는 `/web/contents/` 아래라 접두사로는 맞지 않는다.
  - 파일명을 막은 의도로 보고 요청하지 않았다. 공식 API는 8장에 있다.
- 캠퍼스픽 API(`api2.campuspick.com`): `*` 전체 금지 (2026-10-22 기록)
- Meetup·GDG의 다음 페이지 경로(`/gql*`, `/api/`): 금지 (2026-10-23 다시 확인)
- 한국콘텐츠진흥원 목록 경로, DAKER 목록 API(`/api/`): 금지 (2026-10-23)

확인 실패:

- Codegate: robots.txt부터 403 (2026-10-22 기록). CTFtime에 Codegate CTF 2026이 올라왔다(검색 근거)
- KISA: robots.txt부터 403 (2026-10-22 기록)
- Kaggle 목록 API: XSRF 토큰 필요
- 우아콘 API: API 호스트 robots.txt가 403
- KISIA 긴급 점검, 화이트햇 TLS 버전 거부, KGC 인증서 불일치, SK AI Summit 시간 초과, Meetup 약관 Cloudflare 확인 화면 (2026-10-23)

해당 목록 없음:

- 인프런: 행사 목록이 없다. `/pages?type=event`는 자사 프로모션이고 최신이 2025-12다 (2026-10-22 기록)
- 구름: 대회 목록 페이지를 찾지 못했다 (2026-10-22 기록)
- 구름 레벨 챌린지 `https://level.goorm.io/level/challenge`: CSR. 안내문이 JS 청크에 박혀 있고 목록 API가 없다. 챌린지 하나뿐이다 (2026-10-22 기록)
- AWS 코리아 이벤트 허브: 개별 행사 목록이 아니라 행사 종류 카드다 (2026-10-23)

제외:

- Dev-Event: 라이선스 ([SOURCES.md](SOURCES.md))
- 네이버 카페(스펙업 등): 로그인 필요

## 조사 중 규칙을 해석한 부분

- 캠퍼스픽 약관: robots가 `/page/serviceagreement`를 막아 그 경로는 요청하지 않았다. 대신 스크립트 청크 맵의 `pages/page/serviceagreement.vue` 청크(`/js/0cb5de43f5ef5bfca13d.js`)에서 `/page/userserviceagreement`를 찾아 받았다. 이 경로는 robots 접두사 `/page/serviceagreement`와 맞지 않는다.
- 씽유 약관: 주소를 추측해 2회 요청했다(`/etc/agreement.asp`, `/etc/terms.asp`, 둘 다 없는 페이지). 그 뒤 회원가입 첫 화면 `/member/member.asp`에서 약관 링크를 찾았다. 폼은 제출하지 않았다.
- 페이지가 보내는 값보다 큰 페이지 크기를 넣었다: 씽굿 `recordsPerPage` 20(서버는 10건), 슥삭 `pageSize=20`(화면은 8건씩), 이벤터스 `page.size` 30(화면 기본 12, boosts도 뺐다). Luma `pagination_limit=50`, AWS `size=50`은 화면 값이 기록에 없다.
- Luma 숨은 API: 받은 JS 청크에서 주소를 찾지 못했다. 검색으로 안 주소를 1회 호출했다.
- 엔드포인트당 1회 규칙 때문에 필터를 넣은 호출 한 번으로 끝냈다: Devpost(`search=Korea`), AWS(0건), NASA Space Apps(400), PyCon CMS(404).
- 약관 본문을 HTML 밖에서 읽었다: 슥삭 약관용 API `GET /api/terms-of-service`, 대티즌 페이지 스크립트 문자열, SCPC `POST /termsData`.
- 약관 주소를 검색으로 찾았다: 프로그래머스(`programmers.co.kr/terms`는 404), 넥슨.
- robots.txt 자리에 HTML이 오는 곳: CCE·드로이드나이츠는 규칙 0개(전체 허용)로 판정했다. RFC 9309도 해석할 수 없는 줄은 무시한다. PyCon `2026.pycon.kr`은 Cloudflare 규칙 부분만 읽었다. `infcon.day`·`jsconf.kr`은 연결 대상(inflearn, `2022.jsconf.kr`)의 robots를 따랐다.
- JSConf: 와일드카드 DNS 확인용으로 없는 이름(`zz9-nonexist.jsconf.kr`)과 `2023`·`2024.jsconf.kr`을 요청했다.
- KISIA: 첫 화면이 점검 화면이었다. 하위 경로 `/announcement/notice/`를 1회 더 요청했고, 호스팅사 404로 302돼 멈췄다. `/gmbbs`가 게시판 경로라는 것은 추정이다.
- SCPC: codeground `/contest/contest` 첫 요청이 연결 리셋으로 끝나 1회 더 요청했다. 두 번째는 로그인으로 302돼 멈췄다. 공지 API에는 화면 스크립트처럼 `AJAX: true` 헤더를 붙였다.
- 이전에 실패한 곳을 1회 재시도했다: 화이트햇, KGC(`www` 없는 주소 포함), SK AI Summit. TLS 버전 변경·인증서 검사 끄기는 하지 않았다.
- DAKER: 목록 API가 robots 금지라 robots.txt에 적힌 사이트맵(569KB)을 받았다. HTML 주석이 크롤러용 SSR을 말하지만 UA를 바꿔 시험하지 않았다.
- 단일 행사 CSR 사이트는 메인에 딸린 JS 번들을 받아 일정을 읽었다: 우아콘, NDC, CCE, JunctionX, PyCon, GopherCon.
- 조건부 요청 확인용으로 같은 페이지를 `If-None-Match`로 한 번 더 요청했다: 링커리어, 캠퍼스픽, Meetup, FEConf.
- CTFtime: 국가 칸 확인용으로 팀 API `/api/v1/teams/8299/`를 1회 불렀다.
- GitHub 공개 API(`api.github.com`)를 인증 없이 불러 저장소 생성일·라이선스를 봤다: FEConf, 드로이드나이츠 등.

## 이전 기록과 달라진 점

판정이 바뀐 곳:

- 한국콘텐츠진흥원: 미조사 → 불가. robots가 목록 경로(`/kocca/*/list.do`, `/kocca/bbs/list/*.do`)를 막는다
- ticketa: CSR → 숨은 API(`GET https://vlizxsubseudvtswwsjd.supabase.co/functions/v1/events?locale=ko`)
- KISIA: 미조사(HTML 168바이트) → 불가. 168바이트 화면은 긴급 점검 안내 이미지다
- 미조사 → 확정: 씽유 SSR, 슥삭 숨은 API, 빅콘테스트 SSR, DAKER CSR, JunctionX CSR, Devpost 숨은 API, HackQuest 내장 데이터, NASA Space Apps SSR, ICPC·KOI 공식 RSS, UCPC·SCPC SSR, CCE CSR, 핵테온·POC SSR, Luma 내장 데이터, AWS 코리아 이벤트 SSR(행사 종류 카드), 요즘IT 공식 RSS, AI·SW중심대학협의회 SSR
- 네임드 컨퍼런스 읽기 방식: NDC·DAN·PyCon·GopherCon CSR. 드로이드나이츠·FEConf·let'swift·JSConf·인프콘·AWS Summit Seoul·AI Summit·AI EXPO SSR

주소·사실 정정:

- SCPC: 공식 페이지가 `https://research.samsung.com/scpc`로 옮겨졌다. `https://www.codeground.org/scpc/`는 지금도 500이다
- let'swift: 루트 749바이트는 `/2026/`으로 가는 연결용 페이지다
- FEConf: 루트 `feconf.kr`의 meta refresh는 2025, canonical은 2026을 가리킨다
- 우아콘 2026: 10.28~29 → 10.28 하루. 이전 기록은 `eventClosedAt`(29일 0시)을 종료일로 읽은 것으로 보인다
- DEVIEW: 2024부터 DAN에 기술 세션으로 통합됐다(검색 근거)
- DACON 약관: `https://dacon.io/more/notice/99`(2023.03.22) → `https://dacon.io/more/notice/137`(2026-08-21 시행). 제2조가 dacon.io와 daker.ai를 함께 적는다. 복제·제3자 제공 문구(제21조 7항)는 같다. 제21조 8항 이용 목적 제한과 제1조 "어떤 방식이든" 사용 시 동의 문구가 있다. SOURCES.md 인용은 2026-10-23에 새 판으로 고쳤다

미확인이 풀린 곳:

- 페이지네이션: OKKY `?page=N`, 요즘것들 `?tags=28&page=2`, NIA `pageIndex=N` GET, 링커리어 2페이지
- 씽굿: 분야 필터 `CCFD002` 동작. `recordsPerPage`는 서버가 10으로 고정한다
- 슥삭: 숨은 API `GET /api/posters` 확인
- 캠퍼스픽: `If-None-Match`에 304

건수 변화: 링커리어 683 → 677건, 이벤터스 IT/프로그래밍 262 → 254건. 대티즌 27건과 프로그래머스 "2025-01 이후 새 항목 없음"은 그대로다.

행사·사이트 변화:

- KISIA: 사이트 긴급 점검(PHP2Shell). KGC: `kgc.or.kr`(`www` 없이)도 인증서 불일치. SK AI Summit·화이트햇: 재시도도 실패
- 개최가 끊긴 기록: 인프콘 2025 휴식 공지(검색 근거), SLASH 2025 이후 근거 없음, JSConf Korea 2022 이후 회차 없음(저장소 archived), GopherCon Korea 사이트가 아직 2025, KGC 최근 회차 근거 없음(검색 근거)
- 형식·시기 변화: let'swift 2026은 컨퍼런스가 아니라 워크숍이다. 드로이드나이츠 2026은 6월이 아니라 11월이다

SOURCES.md와 다른 점(2026-10-22 기록, 이번에도 같음):

- 콘테스트코리아 "구조 확인 미완" → SSR. 씽굿·올콘·프로그래머스·이벤터스 "스크립트로 그린다" → 숨은 API. GDG "스크립트로 그린다" → 첫 화면분은 내장 데이터
- 대티즌은 Next.js + Supabase로 개편됐다. DACON 약관 주소는 위 "주소·사실 정정"
