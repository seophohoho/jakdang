# 네임드 주최 조사: platform-a

조사 날짜: 2026-10-23(한국 시간). 기간: 2025-11-01 ~ 2026-10-31.

공통 한계: 세션 공유 WebSearch 한도가 조사 중간에 소진됐다. 그래서 모음 사이트 `site:` 검색을 거의 하지 못했다. "모음 사이트: 미확인"은 이 때문이다. 검색 근거는 한도 소진 전에 얻은 것만 적었다.

## 네이버
- 조사 범위: 네이버(본사 보도자료), 네이버클라우드, NAVER D2. DAN·DEVIEW는 EVENT_SITES 기준. 네이버웹툰·네이버페이·커넥트재단은 보지 않았다
- 공지 위치:
  - 이벤트 목록 페이지 `https://www.navercorp.com/media/pressReleases` — 읽기: SSR / robots: 허용(`Allow: /`) / 회사 전체 보도자료다. 첫 화면 12건 중 개발 행사 0건. DAN25·시큐리티 세미나 공지가 여기 올라왔다(검색 근거)
  - 기술 블로그 RSS `https://d2.naver.com/d2.atom` — 읽기: 공식 API·RSS / robots: robots 없음(`/robots.txt`가 `/NotFound` HTML로 연결된다) / 20건(2026-06-29~10-21) 중 공개 행사 글 0건. "[AI 해커톤 후기]" 3건은 사내 해커톤이다
  - 이벤트 목록 페이지 `https://d2.naver.com/news` — 읽기: CSR / robots: robots 없음 / 4KB 껍데기 HTML뿐이다. 같은 글이 Atom에 들어 있다
  - 이벤트 목록 페이지 `https://www.ncloud.com/support/edu` — 읽기: 내장 데이터 / robots: 허용(빈 파일) / Nuxt 페이로드에 목록(`bbsName`, `title`, `eventStartDate`, `eventStatusText`, `eventPlace`)이 있다. 첫 페이지 4건이 모두 교육이다(공인교육 3, 네이버웍스 교육 1). 분류 필터에 "세미나"·"웨비나"가 있다. `?page=2`도 같은 4건을 준다. 전체 18페이지
  - 공식 행사 사이트 `https://dan.naver.com` — EVENT_SITES 기준(CSR, `/26`은 404)
  - 모음 사이트 `https://event-us.kr/navercloudplatform` — 검색 근거. 네이버클라우드 주최 페이지가 이벤터스에 있다(`/event/25533`). 요청하지 않았다
  - SNS: `https://linkedin.com/company/navercloud`(검색 결과에 보였다)
- 약관: 네이버 공통 약관은 SOURCE_CANDIDATES DEVIEW 항목 기준이다. "네이버의 사전 허락 없이 자동화된 수단(예: 매크로 프로그램, 로봇(봇), 스파이더, 스크래퍼 등)을 이용하여 … 시도해서는 안 됩니다." 네이버클라우드 약관 `https://www.ncloud.com/policy/terms/svc`는 원본 HTML에 본문이 없다(CSR). 미확인
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 2건, 후원 발견 0건
  - DAN25 — 2025-11-06~07 — 컨퍼런스 — 국내(코엑스) — 주최 — 모음 사이트: 미확인 — 근거: EVENT_SITES 기준(검색 근거)
  - NAVER SECURITY SEMINAR(첫 회, 버그바운티 어워드 함께 진행) — 2026-04-30 — 세미나 — 국내(네이버 그린팩토리) — 주최 — 모음 사이트: 미확인 — 근거: 검색 근거 `https://navercorp.com/media/pressReleasesDetail?seq=34995`
- 예정(2026-11 이후): 없다. DAN26은 열지 않는다(검색 근거: 딜사이트 2026-10-20 "올해 DAN이 열리지 않을 예정"). ncloud 11월 공인교육은 교육이라 뺐다
- 메모:
  - 세지 않은 것: 사내 "모두의 Engineering Day AI 해커톤"(D2 2026-07 후기 3건), AI 포텐데이 4회(네이버클라우드·비사이드 공동 주최 해커톤, 2025-09-01 종료 보도, 기간 전, 검색 근거)
  - AI 포텐데이 2026 회차는 찾지 못했다(검색 근거)
  - "네이버클라우드 데이: 클라우드 도입 101"(GS네오텍 공동 웨비나)이 검색에 보였다. 연도 미확인이다
  - DAN은 연 1회(11월)였다. 2026에 끊겼다

## 카카오
- 조사 범위: 카카오(tech.kakao.com), 카카오페이(tech.kakaopay.com), 카카오뱅크(tech.kakaobank.com), 카카오엔터프라이즈(kakaocloud.com, blog.kakaocloud.com). if(kakao)는 EVENT_SITES 기준. 카카오모빌리티는 공지 위치를 찾지 못했다(미확인)
- 공지 위치:
  - 기술 블로그 RSS `https://tech.kakao.com/feed` — 읽기: 공식 API·RSS / robots: 허용(`Disallow:` 빈 값) / 10건(2026-08-31~10-22) 중 행사 글 6건(if(kakao)26 5건, 카카오 AI 돛 Summit 26 다시보기 1건). `description`이 비어 있어 제목만 쓸 수 있다
  - 이벤트 목록 페이지 `https://tech.kakao.com/events` — 읽기: CSR / robots: 허용 / 설명이 "카카오가 주최하거나 후원 및 참여하는 다양한 기술 이벤트"다. 원본 HTML 목록은 "등록된 글이 없습니다"다. `__NUXT_DATA__`에는 태그만 있다(`techmeet` 29건, `meetup` 39건, `conference` 79건). `apiBase`는 `https://tech.kakao.com`. 진입 번들에서 `/api/v1/gnb-menu`, `/api/v1/tags/popular`만 찾았다. 목록 API 경로 미확인
  - 기술 블로그 메인 `https://tech.kakao.com/` — 읽기: 내장 데이터 / robots: 허용 / `__NUXT_DATA__`에 최근 글 3건의 본문 앞부분이 있다. 돛 Summit 날짜·장소는 여기서 읽었다
  - 공식 행사 사이트 `https://if.kakao.com` — EVENT_SITES 기준(SSR)
  - 모음 사이트 `https://festa.io/hosts/388` — tech.kakao.com 푸터 "Kakao Tech Meet" 링크다. robots: 금지(`User-agent: *` `Disallow: /`, Squarespace 기본형). 요청하지 않았다
  - 기술 블로그 RSS `https://tech.kakaopay.com/rss.xml` — 읽기: 공식 API·RSS / robots: 허용 / 항목 0건, 채널 정보뿐이다. 메인 `https://tech.kakaopay.com/`은 SSR이다(최근 5건 2026-06-12~09-16, 행사 글 0건)
  - 기술 블로그 RSS `https://tech.kakaobank.com/index.xml` — 읽기: 공식 API·RSS / robots: robots 없음(`robots.txt`가 403 S3 AccessDenied) / 60건(2025-02~2026-10). 기간 내 행사 글은 사내 컨퍼런스 후기와 외부 대회 참가기뿐이다
  - 기술 블로그 RSS `https://blog.kakaocloud.com/rss` — 읽기: 공식 API·RSS / robots: 허용(`/search`·`/manage` 등만 금지) / 티스토리다. 10건(2026-06-15~09-04) 중 행사 후기 1건. `https://kakaocloud.com/`(robots 허용)에는 행사 메뉴가 없고 뉴스 카드로 이 글을 연결한다
  - SNS: `https://www.youtube.com/@kakaotech`, `https://www.facebook.com/kakaotech`, `https://pf.kakao.com/_qmkxcs`(tech.kakao.com 링크)
- 약관: 미확인. tech.kakao.com 약관 링크 `https://www.kakao.com/policy/oppolicy?lang=ko`는 robots 금지라 받지 않았다(SOURCE_CANDIDATES if(kakao) 기준). 계열사 블로그 약관도 미확인
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 3건(그중 2건은 ※ 판단 필요), 후원 발견 0건
  - if(kakao)26 — 2026-10-13~14 — 컨퍼런스 — 국내(카카오 AI 캠퍼스) — 주최 — 모음 사이트: 미확인 — 근거: EVENT_SITES 기준, `https://tech.kakao.com/feed`
  - 카카오 AI 돛 Summit 26 — 2026-09-29 — 컨퍼런스 — 국내(부산, 약 800명) — 주최 — 모음 사이트: 미확인 — 근거: `https://tech.kakao.com/` 내장 데이터(글 842 "지난 9월 29일 부산에서 약 800명의 참가자와 함께한 '카카오 AI 돛 Summit 26'"). ※ 작성자 소개가 "비수도권 AI 인재 양성과 창업 생태계 조성"이다. 교육 프로그램 행사면 빼야 한다
  - 증권형 AI 인프라 전략 세미나(카카오엔터프라이즈·델테크놀로지스코리아) — 날짜 미확인(후기 2026-09-04) — 세미나 — 국내 — 공동 주최 — 모음 사이트: 미확인 — 근거: `https://blog.kakaocloud.com/rss`(글 290). ※ 증권사 IT·인프라 담당자 대상 고객 세미나다. 공개 모집 여부 미확인
- 예정(2026-11 이후): 찾지 못했다
- 메모:
  - 세지 않은 것: KodeRunner 2026(카카오뱅크 "사내 기술 컨퍼런스", 2026-08 코엑스), if(kakao)25(2025-09-23~25, 기간 전)
  - if(kakao)는 매년 9~10월이다(EVENT_SITES 기준). 2026은 예고 8/30, 개최 공지 9/7이다(RSS 기준)
  - Kakao Tech Meet 최근 회차와 `/events` 글 목록은 미확인이다
  - 카카오모빌리티 행사는 검색 한도 소진으로 찾지 못했다

## 우아한형제들(배달의민족)
- 조사 범위: 우아한형제들 기술블로그. 우아콘은 EVENT_SITES 기준
- 공지 위치:
  - 기술 블로그 RSS `https://techblog.woowahan.com/feed/` — 읽기: 공식 API·RSS / robots: 허용(`/wp-admin/`만 금지) / 10건(2026-08-31~10-21) 중 행사 공지 1건(WOOWACON 2026, 9/23)
  - 기술 블로그 RSS `https://techblog.woowahan.com/category/woowa-tech-seminar/feed/` — 읽기: 공식 API·RSS / robots: 허용 / 우아한테크세미나 카테고리다. 마지막 글은 2024-12-06 "[다시 보기] 12월 우아한테크세미나"다. ETag·Last-Modified 있음
  - 기술 블로그 RSS `https://techblog.woowahan.com/category/notice/feed/` — 읽기: 공식 API·RSS / robots: 허용 / 3건. "[마감] WOOWACON 2025에 지금 등록하세요!"(2025-09-25)가 있다
  - 공식 행사 사이트 `https://woowacon.com` — EVENT_SITES 기준(CSR)
  - 모음 사이트 ticketa — SOURCE_CANDIDATES ticketa 기준 "WOOWACON 2026"이 등재돼 있다
- 약관: 기술블로그에 이용약관이 없다(푸터에 `/privacy-policy/`만). 우아콘도 약관 없음(SOURCE_CANDIDATES 기준). 회사 공통 약관 미확인
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - WOOWACON 2026 — 2026-10-28(예정, 기간 안) — 컨퍼런스 — 국내(그랜드인터컨티넨탈 서울 파르나스) — 주최 — 모음 사이트: ticketa(SOURCE_CANDIDATES 기준) — 근거: EVENT_SITES 기준, `https://techblog.woowahan.com/feed/`(글 27782)
- 예정(2026-11 이후): 찾지 못했다
- 메모:
  - 우아한테크세미나는 2024-12 이후 블로그 글이 없다. 기간 내 회차 0건(블로그 기준). 다른 채널에서 열렸는지는 미확인
  - 블로그 카테고리에 "우아한테크캠프"(교육 프로그램이라 제외), "우아한스터디"(마지막 모집 2024 여름)가 있다
  - EVENT_SITES는 "2025는 블로그 사전 공지가 없었다"고 적었다. notice 카테고리에는 2025-09-25 날짜의 WOOWACON 2025 등록 글이 있다
  - 우아콘은 매년 10월이다. WOOWACON 2025(2025-10-28)는 기간 전이다

## 토스(비바리퍼블리카)
- 조사 범위: 토스(toss.tech, 토스피드). toss.tech에는 토스뱅크·토스증권 글도 섞여 있다. SLASH는 EVENT_SITES 기준
- 공지 위치:
  - 기술 블로그 RSS `https://toss.tech/rss.xml` — 읽기: 공식 API·RSS / robots: robots 없음(404) / 20건(2026-09-08~10-23) 중 공개 행사 글 0건
  - 기술 블로그 RSS `https://toss.im/tossfeed/rss.xml` — 읽기: 공식 API·RSS / robots: 허용(`/tossfeed` 미차단. `/pages/ssr/events/`는 명시 허용) / 20건(2026-07-28~10-23) 중 행사 글 0건
  - 공식 행사 사이트 `https://toss.im/slash-24` — EVENT_SITES 기준(SSR, `slash-25`·`slash-26` 404)
- 약관: SOURCE_CANDIDATES SLASH 기준 `https://toss.im/docs/11027`. 크롤링 명시 조항은 없다. 제26조 ② "회원은 … 얻은 정보를 가공, 제공, 판매하는 등 영리 목적으로 이용하거나 제3자에게 이용하게 할 수 없습니다."
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건, 후원 발견 0건
- 예정(2026-11 이후): 찾지 못했다
- 메모:
  - toss.tech 글 "실행은 도메인별로, 문맥은 한 레포에"의 "9월 팀 해커톤"은 사내 행사다
  - SLASH는 2024 이후 근거가 없다(EVENT_SITES 기준). SLASH 외 행사는 검색 한도 소진으로 찾지 못했다

## 쿠팡
- 조사 범위: 쿠팡 엔지니어링 블로그(Medium), 쿠팡 뉴스룸
- 공지 위치:
  - 기술 블로그 RSS `https://medium.com/feed/coupang-engineering` — 읽기: 공식 API·RSS / robots: 허용(`*` 그룹은 `/feed/`를 막지 않는다. ClaudeBot·GPTBot 등 8종은 `Disallow: /`) / 10건, 마지막 글 2024-10-14. 행사 글 0건
  - 이벤트 목록 페이지(뉴스룸) `https://news.coupang.com/feed/` — 읽기: 공식 API·RSS / robots: 허용(GPTBot·ClaudeBot 등도 명시 허용) / 12건(2026-10-15~10-23) 중 개발 행사 0건. 1주치만 담긴다
- 약관: 미확인. Medium 약관 `https://policy.medium.com/medium-terms-of-service-9db0094a1e0f`는 Cloudflare 차단 화면이었다(403, "Sorry, you have been blocked"). 뉴스룸 약관은 받지 않았다
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건, 후원 발견 0건
- 예정(2026-11 이후): 찾지 못했다
- 메모: 개발자 행사 공지 위치를 찾지 못했다. 엔지니어링 블로그는 2024-10 이후 멈췄다. 검색 확인은 한도 소진으로 하지 못했다

## 당근
- 조사 범위: 당근 기술 블로그(Medium), 당근 채용 블로그
- 공지 위치:
  - 기술 블로그 RSS `https://medium.com/feed/daangn` — 읽기: 공식 API·RSS / robots: 허용(쿠팡 항목과 같은 Medium robots) / 10건(2026-07-14~10-21) 중 행사 글 0건
  - 이벤트 목록 페이지(채용 블로그) `https://careers.daangn.com/blog/` — 읽기: SSR / robots: 허용(`/preview`, `/jobs/completed`, `/jobs/role/*/apply`만 금지) / `about.daangn.com/blog/`가 308로 연결한다. 글 링크 97건이 있지만 날짜가 HTML에 없다. 테크 밋업 글 2건("제1회 당근 테크 밋업 현장을 소개해요", "테크 밋업 일꾼단이 전하는 행사 비하인드"), 해커톤 글 3건이 있다
- 약관: 미확인(Medium 약관 403, 채용 사이트 약관은 받지 않았다)
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건 확인, 후원 발견 0건
- 예정(2026-11 이후): 찾지 못했다
- 메모:
  - 당근 테크 밋업은 2024-10-07 코엑스가 첫 회다(4트랙 28발표, 최대 1천 명, 검색 근거: ditoday `https://ditoday.com/?p=109940`). 2025·2026 회차는 찾지 못했다(검색 근거)
  - 채용 블로그 "엔지니어를 넘어 '빌더'로, 당근 Builder's Camp 해커톤"("2주간의 AI 해커톤 여정")은 날짜·공개 여부 미확인이다

## LINE(LY Corporation, LINE Plus)
- 조사 범위: LY Corporation(Tech-Verse, 기술 블로그 한국어판), LINE Plus(보도자료)
- 공지 위치:
  - 공식 행사 사이트 `https://tech-verse.lycorp.co.jp/` — 읽기: SSR / robots: robots 없음(`robots.txt`가 403, 404 페이지) / 루트는 meta refresh로 `/2026/ja/`에 간다. 루트 JSON-LD `Event`에 `startDate 2026-06-29T10:00:00+09:00`, `OnlineEventAttendanceMode`, organizer "LINEヤフー"가 있다. `/2026/ko/`에 세션 제목·발표자가 HTML로 있다. Last-Modified·ETag 있음
  - 기술 블로그 RSS `https://techblog.lycorp.co.jp/ko/feed/index.xml` — 읽기: 공식 API·RSS / robots: 허용 / 50건(2026-03-17~10-16). 행사 관련은 Tech-Verse 2026 세션 글 10건, 참관기 1건, 사내 워크숍(ODW) 글뿐이다
  - 이벤트 목록 페이지(보도자료) `https://www.linepluscorp.com/pr/news/` — 읽기: SSR / robots: robots 없음(`robots.txt`가 403, 404 페이지) / 11건 중 Tech-Verse 2026 개최(2026-06-16)·후속(07-06) 2건
- 약관: 미확인
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건(규칙 적용), 후원 발견 0건
- 예정(2026-11 이후): 찾지 못했다
- 메모:
  - Tech-Verse 2026 — 2026-06-29 — 온라인 컨퍼런스 — LY Corporation 주최. 한국어 페이지와 LINE Plus 발표자가 있다. 해외 주최 온라인 시청형이라 세지 않았다. 국내 행사로 볼지는 사용자 판단이 필요하다
  - Tech-Verse 공지는 행사 13일 전이었다(LINE Plus 보도자료 06-16)
  - LINE Plus 국내 밋업은 찾지 못했다(블로그 2026-03 이후 기준). 2025-11~2026-03은 미확인

## 묶음 요약
- 기간 내 행사 0건: 토스, 쿠팡, 당근, LINE(Tech-Verse 2026은 해외 온라인 시청형이라 뺐다). 카카오 2건(돛 Summit, 증권사 세미나)은 규칙 적용 판단이 필요하다.
- 읽기 불가 주최는 없다. 7곳 모두 RSS나 SSR 공지 위치가 있다. 단 tech.kakao.com `/events`와 d2 `/news`는 CSR이고, Kakao Tech Meet의 festa.io는 robots 전체 금지다.
- 기간 내 행사는 연 1회 대형 컨퍼런스 위주다(DAN25, if(kakao)26, WOOWACON 2026). DAN26은 열리지 않는다. 우아한테크세미나는 2024-12 이후 블로그 기록이 없다.
- 모음 사이트 등장은 WOOWACON 2026(ticketa, SOURCE_CANDIDATES 기준)만 확인했다. 나머지는 검색 한도 소진으로 미확인이다. 네이버클라우드는 이벤터스 주최 페이지가 있다(검색 근거).
