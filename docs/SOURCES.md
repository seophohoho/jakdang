# 수집처 조사 기록

확인 날짜: 2026-10-22 (한국 시간). 조사 방법은 curl로 목록 페이지·robots.txt·약관을 직접 받아 HTML 구조를 확인했고, 이후 `npm run sources:check`로 실제 수집 코드를 통과시켰다.

이 봇은 아래 3개 목록만 본다. 국내 개발자 행사 전체를 포괄하지 않는다.

## 운영 소스 요약

| id           | 이름                         | 구분                | 수집 방식      | 키워드 필터 | 평소 실행 / bootstrap 범위    |
| ------------ | ---------------------------- | ------------------- | -------------- | ----------- | ----------------------------- |
| `wevity-it`  | 위비티 웹/모바일/IT 공모전   | 플랫폼(공모전 모음) | HTML + cheerio | 사용        | 2페이지 / 5페이지             |
| `dacon`      | DACON 대회                   | 플랫폼(대회 목록)   | HTML + cheerio | 미사용      | 1페이지 / 1페이지             |
| `oss-notice` | 오픈소스 포털(NIPA) 공지사항 | 공식 기관           | HTML + cheerio | 사용        | 1페이지(20건) / 3페이지(60건) |

RSS를 실제로 제공하면서 수집이 허용된 후보는 찾지 못했다. 그래서 운영 소스는 모두 HTML이다. RSS 파서는 합성 fixture(`tests/fixtures/rss/synthetic-feed.xml`)로만 검증한다.

### 네 가지 행사 유형을 다루는 정도

- 대회·공모전: 위비티(IT 분류), DACON(AI·데이터 대회), 오픈소스 포털(오픈소스 개발자대회 공지).
- 해커톤: 위비티·DACON에 해커톤 공고가 올라온다(예: 위비티 ix=111843, DACON 236767).
- 컨퍼런스: 오픈소스 포털의 `[행사안내]` 공지에서만 가끔 잡힌다(예: 4660). 커버리지가 약하다.
- 밋업·세미나: 오픈소스 포털 키워드에 넣었지만 실제 게시가 드물다. 사실상 다루지 못한다.

컨퍼런스·밋업·세미나 공백의 원인: 이 유형을 가장 많이 모아 둔 Dev-Event를 라이선스 문제로 제외했다(아래 "제외한 후보" 참고). 이벤터스·온오프믹스·Meetup·ticketa도 아래 사유로 쓸 수 없었다.

## 공통 수집 규칙

- 목록 페이지만 요청한다. 상세 페이지와 접수 링크는 요청하지 않는다.
- 요청 간격: 같은 호스트에 최소 1초. 같은 호스트 동시 요청은 1개, 전체 동시 요청은 최대 3개다.
- 타임아웃은 요청당 10초 이하이고, 남은 작업 시간보다 짧게 잡는다.
- 응답 크기는 2MB로 제한한다. 리디렉션은 자동으로 따라가지 않고 목적지마다 허용 호스트를 검사한다.
- 사설·메타데이터 주소는 막는다. URL에 IP가 직접 적혔을 때와 DNS 결과가 사설 주소일 때 모두 해당한다.
- User-Agent: `Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)`
  - 처음에 쓴 `jakdang-event-bot/0.1 (personal developer event notifier)`는 oss.kr이 HTTP 403으로 거부했다(2026-10-22 확인).
  - `Mozilla/5.0 (compatible; 봇이름)`은 Googlebot도 쓰는 표준 봇 표기다. 봇 이름은 그대로 밝힌다. 세 사이트의 robots.txt `User-agent: *` 규칙은 수집 경로를 허용한다.
- 항목 링크는 소스의 `allowedHosts`에 있는 HTTP(S) 주소만 받는다. 어댑터는 허용 호스트 링크에만 정규 링크 변환을 적용한다.

## 이용 조건 공통 주의

세 사이트 모두 약관에 "서비스에서 얻은 정보를 상업적으로 이용하지 말 것"이 있다. DACON과 오픈소스 포털에는 "제3자 제공 금지" 조항도 있다. 이 봇은 개인용·비상업이고, 제목과 링크만 저장·전송한다. 알림 채널(Discord·Mattermost)을 다른 사람과 공유한다면 "제3자 제공"에 해당할 수 있으므로 운영자가 판단한다. 해당 소스는 `src/sources.ts`의 `enabled: false`로 끌 수 있다.

---

## 1. `wevity-it` — 위비티 웹/모바일/IT 공모전

- 목록 URL: `https://www.wevity.com/?c=find&s=1&gub=1&cidx=20`
- 구분: 플랫폼(공모전 모음 사이트)
- 수집 방식: 서버가 그린 HTML을 cheerio로 파싱
- 선택자
  - 컨테이너: `div.ms-list > ul.list` (없으면 parser_error)
  - 항목: `li:not(.top)` (`li.top`은 표 머리글)
  - 제목·링크: `div.tit > a`. 제목에서 `span`(SPECIAL·신규·IDEA 배지)은 제거
- 항목 ID: 링크의 `ix` 쿼리 값(숫자)
- 정규 링크: `https://www.wevity.com/?c=find&s=1&gbn=view&ix=<ix>`
  - 목록 링크의 `gp`(페이지)·`cidx`(분류)는 목록 상태 값이라 뺀다.
  - 이 주소는 302로 `gbn=viewok&gp=1&ix=<ix>` 상세 화면에 연결됨을 확인했다(ix=111843).
- 페이지네이션: `gp=<n>`. 페이지당 약 15건이다.
  - 1페이지 맨 위에는 광고성 SPECIAL 항목 7건이 고정된다. 2페이지에는 SPECIAL이 반복되지 않았다.
  - 평소 실행 2페이지, bootstrap 5페이지. 새 항목이 없는 페이지를 만나면 멈춘다.
- robots.txt (`https://www.wevity.com/robots.txt`): `User-agent: *` `Allow:/`. GPTBot에만 `Crawl-delay: 3`이 있고 이 봇에는 해당 없다. 요청 간격 1초.
- 이용약관 (`https://www.wevity.com/?c=intro&s=4`)
  - "서비스내에 게시되거나 등록된 자료의 지적재산권은 WEVITY(위비티)에 있습니다"
  - "이용자는 서비스를 이용하여 얻은 정보를 가공, 판매하는 행위 등 서비스에 게재된 자료를 상업적으로 이용할 수 없습니다"
  - 자동 수집을 금지하는 조항은 찾지 못했다.
- 행사 유형: 공모전·경진대회·해커톤. 컨퍼런스·밋업은 거의 없다.
- 비개발 항목: 섞인다.
  - SPECIAL 광고 항목에 영상·슬로건·창업 공모전이 들어온다(예: "션샤인 TIME TRAVEL 숏폼 영상 공모전").
  - 일반 항목에도 AI 이미지·영상 콘텐츠 공모전이 있다.
- 키워드(제목, 대소문자 무시, 하나라도 포함):
  `해커톤, 개발, 앱, 소프트웨어, SW, 프로그래밍, 코딩, 알고리즘, 데이터, data, AI, 인공지능, 보안, 해킹, 사이버, 클라우드, 오픈소스, 블록체인, 메타버스, 로봇, 게임`
  - 알려진 오탐(false positive, 걸러야 할 것을 통과시킴): "AI"가 들어간 광고·영상 공모전이 통과한다(예: "2026 화성특례시 AI CF 공모전").
  - 알려진 누락: 키워드가 없는 IT 공모전은 빠진다(예: "2026 K-AWARDS DIGITAL EXCELLENCE AWARDS").
  - `IT`는 "Competition"·"DIGITAL" 같은 영어 단어에도 걸려서 키워드에서 뺐다.
- 수집 누락 가능 범위
  - 웹/모바일/IT 분류(cidx=20)만 본다. 게임/소프트웨어 분류(cidx=21)는 보지 않는다.
  - 하루에 2페이지(약 30건)보다 많이 올라오면 3페이지 이후는 놓친다.
- 직접 확인한 항목(2026-10-22)
  - `111843` 2026 한림 G-Lab@동해 AI활용 지역문제해결 해커톤 — `https://www.wevity.com/?c=find&s=1&gbn=view&ix=111843`
  - `111802` 현대자동차그룹 차량용 앱 개발 공모전 — `https://www.wevity.com/?c=find&s=1&gbn=view&ix=111802`
  - `110023` 2026 DATA·AI 분석 경진대회 (SPECIAL) — `https://www.wevity.com/?c=find&s=1&gbn=view&ix=110023`
- fixture: `tests/fixtures/sources/wevity-it-page1.html`, `wevity-it-page2.html`(실제 페이지 축약)
  - 합성 fixture: `tests/fixtures/synthetic/wevity-no-container.html`, `wevity-empty-list.html`, `wevity-invalid-items.html`

## 2. `dacon` — DACON 대회

- 목록 URL: `https://dacon.io/competitions`
- 구분: 플랫폼(AI·데이터 대회 운영 사이트)
- 수집 방식: 서버 렌더링(SSR, 서버가 HTML을 완성해서 보내는 방식) HTML을 cheerio로 파싱. 페이지 크기는 약 770KB다.
- 선택자
  - 컨테이너: `div.official-comp`
  - 항목: `div.comp > a`
  - 제목: `p.name`
  - 링크: 항목 `a` 자체
- 항목 ID: 경로 `/competitions/official/<숫자>/`의 숫자
- 정규 링크: `https://dacon.io/competitions/official/<id>/overview/`. 302로 `.../overview/description`에 연결됨을 확인했다.
- 페이지네이션: 없음. `?page=2`도 같은 목록을 돌려줬다. 평소·bootstrap 모두 1페이지이고, 목록에는 15건 안팎이 보인다.
- 조건부 요청: 응답에 `ETag`가 있다. 내용이 같으면 304로 끝난다.
- robots.txt (`https://dacon.io/robots.txt`): `/myprofile`, `*.php`, `/edu/online/secret` 등만 막는다. `/competitions`는 허용이다. 요청 간격 1초.
- 이용약관 (`https://dacon.io/more/notice/137`, "데이콘 주식회사 이용약관(26.08.21)", 시행일자 2026년 8월 21일. 2026-10-23 확인)
  - 제21조 7항: "“회원”은 서비스를 이용하여 얻은 정보를 “회사”의 사전동의 없이 복사, 복제, 번역, 출판, 방송 등의 방법으로 사용하거나 이를 타인에게 제공할 수 없다."
  - 제21조 8항: "“회원”은 본 서비스를 건전한 대회 참여, 학습의 목적, “기업회원”의 채용 의뢰에 대한 지원 이외의 목적으로 사용해서는 안 되며"
  - 제1조: "어떤 방식이든 본 서비스를 사용한다는 것은 “회원”이 본 약관의 전부에 동의한다는 것을 의미하며"
  - 제2조 1항은 적용 사이트로 dacon.io와 daker.ai를 함께 적는다.
  - 조항의 주어는 회원이다. 이 봇은 로그인하지 않는다. 다만 제1조는 "어떤 방식이든" 사용하면 동의한 것으로 본다. 위 "이용 조건 공통 주의"를 따른다.
  - 이전 판: `https://dacon.io/more/notice/99`, "이용약관 전문 (2023.03.22)". 7항과 같은 문구가 있었다.
- 행사 유형: AI·데이터 경진대회, 해커톤(LG Aimers 등), 연습 대회. 모두 개발 관련이라 키워드를 쓰지 않는다.
- 수집 누락 가능 범위
  - 목록에 보이는 공식 대회만 본다. 목록에서 빠진 과거 대회는 보지 않는다.
  - 마감·연습 상태 대회도 목록에 있으면 신규로 알린다.
- 직접 확인한 항목(2026-10-22)
  - `236771` 항만 문제해결을 위한 AI 기술 공모전 — `https://dacon.io/competitions/official/236771/overview/`
  - `236767` Aimers 9기 : 투구 제구 성공 확률 예측 AI 오프라인 해커톤 — `https://dacon.io/competitions/official/236767/overview/`
  - `236693` 2026 AI·SW중심대학 디지털 경진대회 : SW부문 — `https://dacon.io/competitions/official/236693/overview/`
- fixture: `tests/fixtures/sources/dacon-competitions.html`(실제 페이지 축약)

## 3. `oss-notice` — 오픈소스 포털(NIPA) 공지사항

- 목록 URL: `https://www.oss.kr/pages/10?pageSize=20` (정보통신산업진흥원 오픈소스 포털)
- 구분: 공식 기관
- 수집 방식: 서버가 그린 HTML을 cheerio로 파싱
- 선택자
  - 컨테이너: `ul#list`
  - 항목: `li.search-item`
  - 링크: `a.post-link`
  - 제목: `p.title > strong > span:last-of-type` (`[공지]`·`[공지사항]` 분류 표시는 제외)
- 항목 ID: 링크의 `data-post-id` 속성. 없으면 경로 `/pages/10/<숫자>`
- 정규 링크: `https://www.oss.kr/pages/10/<id>`. 목록 상태 인자(`page`, `pageSize`, `searchKeyword`, `searchType`)는 뺀다. 200 응답과 제목 일치를 확인했다(4660).
- 페이지네이션: `page=<n>`, `pageSize=20`
  - 1페이지 맨 위에 고정 공지 6건이 있다. 확인 시점 전체 게시물은 56건이다.
  - 평소 1페이지, bootstrap 3페이지(최대 60건).
- robots.txt (`https://www.oss.kr/robots.txt`)
  - `User-agent: *`는 `/admin/`, `/login`, `/logout`, `/error`, `/.well-known/` 등만 막는다.
  - 검색엔진 그룹에는 `/pages/13`, `/pages/7`, `/pages/search` 금지와 `Crawl-delay: 1`이 있다. 이 봇도 1초 간격을 지킨다.
  - `curl`, `wget`, `python-requests`, `Java` 같은 일반 도구 UA는 전면 차단한다.
- 이용약관 (`https://www.oss.kr/pages/17`)
  - 제15조는 "서비스를 이용하여 얻은 정보를 당 사이트의 사전승낙 없이 이용자의 이용 이외의 목적으로 복제하거나 이를 출판, 방송 등에 사용하거나 제3자에게 제공하는 행위"를 금지한다.
  - 제17조는 상업적 이용을 금지한다.
- 행사 유형: 오픈소스 개발자대회, `[행사안내]` 컨퍼런스. 그 외 대부분은 교육 모집·선발 결과·운영 공지다.
- 키워드:
  `행사, 컨퍼런스, 콘퍼런스, 세미나, 밋업, 해커톤, 대회, 공모, 챌린지, 포럼, 워크숍, 웨비나, 데모데이, 심포지엄`
  - "컨트리뷰톤" 공지는 모집·결과 안내가 대부분이라 키워드에 넣지 않았다.
- 수집 누락 가능 범위
  - 게시량이 적다(56건 누적).
  - 행사 공지가 키워드 없는 제목으로 올라오면 빠진다.
- 직접 확인한 항목(2026-10-22)
  - `4660` [행사안내] 래블업 AI 인프라 기술 컨퍼런스 개최(9/29) — `https://www.oss.kr/pages/10/4660`
  - `4540` 20주년 맞은「2026년 오픈소스 개발자대회」개막! — `https://www.oss.kr/pages/10/4540`
  - 키워드로 제외된 예: `4661` 오픈소스포털(oss.kr) 클라우드 이관 안내
- fixture: `tests/fixtures/sources/oss-notice-page1.html`(실제 페이지 축약)

---

## 제외한 후보

| 후보                                                                            | 확인한 것                                                                  | 제외 사유                                                                                                                                 |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Dev-Event (`raw.githubusercontent.com/brave-people/Dev-Event/master/README.md`) | 월별 행사 100건. 세미나 56·대회 23·모임 19. 컨퍼런스·밋업을 가장 많이 다룸 | LICENSE가 독점 라이선스다. 허락 없는 "일부 복제·재배포"(2(a))와 "데이터셋·편집물 생성"(2(d))을 금지한다. 사용자 결정(2026-10-22)으로 제외 |
| 이벤터스 (`event-us.kr/search?category=IT/프로그래밍`)                          | HTML에 광고 배너 8건만 있음                                                | 검색 결과를 브라우저 스크립트로 그린다. robots.txt가 `/rss/event`를 금지한다. IT 분류에 HR·기후테크 행사가 섞인다                         |
| 온오프믹스 (`onoffmix.com`)                                                     | robots.txt                                                                 | `User-agent: *` `Disallow: /`. 검색엔진·지정 봇만 허용한다                                                                                |
| Festa (`festa.io`)                                                              | 첫 화면                                                                    | "Coming Soon" 페이지만 나온다. 서비스가 운영되지 않는다                                                                                   |
| Meetup AWSKRUG RSS (`meetup.com/awskrug/events/rss/`)                           | 실제 RSS 7건                                                               | robots.txt가 `*/events/rss/*`를 금지한다                                                                                                  |
| ticketa (`ticketa.co`)                                                          | 첫 화면                                                                    | 행사 목록을 클라이언트에서 그린다. HTML에 목록이 없다                                                                                     |
| 올콘 (`all-con.co.kr`)                                                          | RSS 링크 `as_rss.php`                                                      | RSS가 PHP Fatal error를 돌려준다. 목록은 AJAX(`/page/ajax.contest_list.php`)로만 온다                                                     |
| 씽굿 (`thinkcontest.com`)                                                       | 공모전 목록 페이지                                                         | 목록을 스크립트로 불러온다                                                                                                                |
| 콘테스트코리아 (`contestkorea.com`)                                             | IT·소프트웨어·게임 분류 페이지                                             | 본문 목록 영역을 HTML에서 찾지 못했다. 구조 확인 미완                                                                                     |
| 프로그래머스 챌린지 (`school.programmers.co.kr/competitions`)                   | 페이지                                                                     | 목록을 클라이언트에서 그린다                                                                                                              |
| GDG 커뮤니티 (`gdg.community.dev/gdg-seoul/`)                                   | 챕터 페이지                                                                | 예정 행사를 스크립트로 그린다. robots.txt가 `/api/`를 금지한다                                                                            |

## 소스 고장 시 확인 순서

1. `npm run sources:check -- --source <id>`로 상태·파싱 건수·오류 종류를 본다.
2. `parser_error`면 실제 페이지에서 선택자를 다시 확인한다.
3. 그다음 fixture를 갱신하고 `parserVersion`을 올린다.
4. 고치기 전까지는 `enabled: false`로 그 소스만 끈다.
