# global 묶음 조사

- 조사일: 2026-10-23(KST). 대상 기간: 2025-11-01 ~ 2026-10-31.
- 세션 WebSearch 한도(200회)가 조사 중 소진됐다. 그래서 과거 행사 검색과 모음 사이트 `site:` 검색을 다 하지 못한 주최가 많다. "미확인(검색 한도)"은 이 때문이다.

## AWS
- 조사 범위: 2026-10-23. 직접 요청 7회(robots 2, 행사 페이지 4, 블로그 RSS 1). AWS Summit Seoul·AWS 코리아 이벤트 허브·AWS 약관은 다시 받지 않았다. AWSKRUG·AWS Community Day는 다른 묶음이다. WebSearch 한도가 중간에 소진되어 웨비나 일정은 찾지 못했다.
- 공지 위치:
  - 이벤트 목록 페이지 `https://aws.amazon.com/ko/events/` — 읽기: SSR / robots: 허용 / EVENT_SITES 기준. 행사 종류 카드뿐이다
  - 공식 행사 사이트 `https://aws.amazon.com/ko/events/summits/seoul/` — 읽기: SSR / robots: 허용 / EVENT_SITES 기준
  - 공식 행사 사이트 `https://aws.amazon.com/ko/events/aws-innovate/` — 읽기: SSR / robots: 허용 / "2025 Innovate 이벤트" 1건(날짜 2025-04-08, 영어·일본어·한국어 온디맨드)만 있다. 2026 회차 표시가 없다
  - 공식 행사 사이트 `https://aws.amazon.com/ko/events/industry-week/games-on-aws/` — 읽기: SSR / robots: 허용 / 본문이 아직 2025 회차(2025-10-14 코엑스)다. 문의처 `aws-korea-event@amazon.com`
  - 공식 행사 사이트 `https://aws.amazon.com/ko/events/builders-online-series/` — 읽기: SSR / robots: 허용 / 소개 글뿐이고 날짜가 없다
  - 기술 블로그 RSS `https://aws.amazon.com/ko/blogs/korea/category/events/feed/` — 읽기: 공식 API·RSS / robots: 허용(`/*/blogs/*/tag/`만 금지) / 10건(2025-12-16~2026-06-24)이 전부 신규 서비스 발표 글이다. 국내 행사 공지 0건
  - 이벤트 목록 페이지 `https://startups.aws.com/ko/events?lang=ko` — 읽기: CSR / robots: 허용(`/api/` 금지) / `aws.amazon.com/startups/events`에서 리다이렉트된다. Next.js RSC 껍데기에 필터 UI만 있고 행사 카드가 없다. 숨은 API 후보 `/api/`는 robots 금지라 찾지 않았다
  - 모음 사이트 `https://event-us.kr/gsneotek/event/137126` — 읽기: 숨은 API(EVENT_SITES 기준) / robots: EVENT_SITES 기준 / Games on AWS 2026 신청 페이지(검색 근거)
- 약관: `https://aws.amazon.com/terms/`. SOURCE_CANDIDATES 기준. "This license does not include … any use of data mining, robots, or similar data gathering and extraction tools." 방문자 전체 대상이다.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 4건, 후원 발견 0건
  - 10,000 AIdeas Competition — 2025-12-05~2026-01-21(1차 제출) — 공모전 — 온라인 — 주최 — 모음 사이트: 미확인 — 근거: 검색 근거 `https://builder.aws.com/content/35ccI7BX1tA5xIkO29YPBQPfvLk/10000-aideas-competition-terms`. 제외 국가 목록에 북한은 있고 한국은 없다
  - AWS Partner Summit Seoul 2026 — 2026-04-21 — 컨퍼런스(파트너사 대상) — 국내(웨스틴 서울 파르나스) — 주최 — 모음 사이트: 찾지 못함 — 근거: 검색 근거 `https://aws.amazon.com/ko/events/summits/seoul/partner`
  - AWS Summit Seoul 2026 — 2026-05-20~21 — 컨퍼런스 — 국내(코엑스) — 주최 — 모음 사이트: 찾지 못함(`site:luma.com`, `site:okky.kr` 검색) — 근거: EVENT_SITES 기준
  - Games on AWS 2026 — 2026-10-27 — 컨퍼런스 — 국내(더블트리 바이 힐튼 서울 판교) — 주최(검색 근거). 이벤터스 채널이 `gsneotek`이라 신청 운영 주체는 미확인 — 모음 사이트: 이벤터스 — 근거: 검색 근거 `https://event-us.kr/gsneotek/event/137126`
- 예정(2026-11 이후): 미확인. AWS Innovate 2026 회차는 공식 페이지에 없다.
- 해외 현장·생중계 행사(세지 않음): re:Invent 2026, AWS AI League 2026 Championship(지역 Summit 예선 + re:Invent 결선. 서울 예선 여부 미확인), AWS Summit New York 2026
- 메모:
  - 커뮤니티 주최라 세지 않았다: AWS Community Builders Day 2026(2026-01-24, 센터필드, 이벤터스 `awskrug` 채널, 검색 근거), AWS Student Community Day 2026 Seoul(2026-07-04, AWS Student Builder Groups 주최, 검색 근거 `https://builder.aws.com/content/3FkDAzEgHK2jO8aegSHzLdlYyb6/ai-in-action-aws-student-community-day-2026-south-korea-seoul`). AWS 후원 여부는 미확인이다
  - 교육이라 뺐다: AWS PartnerEquip Lite Seoul 2026(2026-07-21, 파트너 교육, 검색 근거)
  - 한국어 웨비나(Builders Online Series 등): 2025-07-31 회차는 검색에 보였다. 2025-11 이후 회차는 미확인이다
  - AWS GenAI Loft Seoul(팁스타운)은 2024-10-30~11-06 팝업이었다. 2025~2026 회차는 찾지 못했다(검색 근거)
  - 연간 주기: Summit Seoul 5월, Partner Summit 4월, Games on AWS 10월(검색 근거)

## Google
- 조사 범위: 2026-10-23. 직접 요청 12회(robots 5, 목록·허브 5, RSS 1, Cloud OnAir sitemap 1). GDG·GDG on Campus는 다른 묶음이다. WebSearch 한도가 중간에 소진되어 모음 사이트 등장 여부와 Kaggle 건수는 확인하지 못했다.
- 공지 위치:
  - 기술 블로그 RSS `https://blog.google/intl/ko-kr/rss/` — 읽기: 공식 API·RSS / robots: 허용(검색 경로만 금지) / 20건(2026-09-10~10-16) 중 개발 행사 공지 0건. 대학생 대상 "제미나이와 함께 성수에서" 행사 글 1건
  - 기술 블로그 목록 `https://blog.google/intl/ko-kr/company-news/inside-google/` — 읽기: CSR / robots: 허용 / 원본 HTML에 기사 목록이 없다
  - 이벤트 목록 페이지 `https://developers.google.com/events?hl=ko` — 읽기: SSR / robots: 허용(`/youtube/partner/`만 금지) / 카드 약 6개. Android Dev Summit, Google Cloud Summit 멕시코시티 등 해외·온디맨드뿐이다. 한국 행사 0건
  - 이벤트 목록 페이지 `https://cloud.google.com/events?hl=ko` — 읽기: SSR / robots: 허용 / 13건(10-28~11-19). 날짜·온라인 표시가 HTML에 있다. 대부분 글로벌 온라인 웨비나다. 한국 현장 행사 0건. 서버가 접속 지역으로 목록을 고르는지는 미확인
  - 공식 행사 사이트 `https://cloudonair.withgoogle.com/korea` — 읽기: CSR / robots: 허용(`/admin/`만 금지) / 로그인 위젯 문구뿐이다. robots에 적힌 `sitemap.xml`(881개 URL)에 한국 행사 slug 9개가 있다(lastmod 2026-01-15~2026-09-04)
  - 이벤트 목록 페이지 `https://www.kaggle.com/competitions` — 읽기: CSR / robots: robots 없음(`/robots.txt`가 404 HTML) / 원본 HTML에 제목만 있다
- 약관: `https://policies.google.com/terms`. SOURCE_CANDIDATES GDG 항목 기준. "using automated means to access content from any of our services in violation of the machine-readable instructions on our web pages (for example, robots.txt files …)". robots를 어기는 자동 접근만 금지한다. Kaggle 약관은 미확인.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 3건(날짜 확인) + 날짜 미확인 9건, 후원 발견 0건
  - 제미나이 3 해커톤 — 2026-02-28 — 해커톤 — 국내(서울) — 주최 — 모음 사이트: 미확인 — 근거: 검색 근거 `https://ditoday.com/?p=140733`. 기사에 연도가 없다. 2월 28일 토요일과 Gemini 3 출시 시점으로 2026년이라 판단했다
  - 구글 포 코리아 2026 — 2026-04-29 — 컨퍼런스(회사 연례 발표 행사. 공개 신청 여부 미확인) — 국내(웨스틴 조선) — 주최 — 모음 사이트: 미확인 — 근거: 검색 근거 `https://blog.google/intl/ko-kr/company-news/inside-google/google-for-korea-2026-kr/`
  - 구글 AI 포 비즈니스 2026 — 2026-07-14 — 컨퍼런스(기업 대상) — 국내(신라호텔) — 주최 — 모음 사이트: 미확인 — 근거: 검색 근거 `https://view.asiae.co.kr/article/2026071412513923588`
  - Google Cloud 한국 행사 9건(날짜 미확인. 이름은 Cloud OnAir sitemap slug다): `kr-data-agents-unlocking-the-future-of-data`, `ai-live-and-labs-seoul-2026`, `transform-data-with-google-cloud-database-looker-analytics-korea`, `security-user-forum-korea`, `q326-kr-ge-ai`, `m-trends-2025-emea-by-the-numbers-kr`, `beyond-the-prompt-cloud-run-ai-kr`, `ai-data-and-infrastructure-google-cloud-korea`, `kr-gcs-day-2026` — 웨비나·현장 구분 미확인 — 주최 — 모음 사이트: 미확인 — 근거: 직접 확인 `https://cloudonair.withgoogle.com/sitemap.xml`. 개별 페이지는 받지 않았다
- 예정(2026-11 이후):
  - Asia Pacific Google Cloud Security Summit — 2026-11-05 — 웨비나 — 온라인(APJ 대상) — 근거: 직접 확인 `https://cloud.google.com/events?hl=ko`
  - Google Cloud Labs: OnAir 2건(Deploy ADK agents, Agentic Pitch generator) — 2026-11-19 — 웨비나·실습 — 온라인(한국어 자막 제공, APJ 포함) — 근거: 같은 페이지
  - Gemini 4 Launch Webinar — 2026-11-05(아시아 시간대 회차) — 웨비나 — 온라인(스타트업 대상, 한국어 여부 미확인) — 근거: 같은 페이지
- 해외 현장·생중계 행사(세지 않음): Google I/O 2026, Android Dev Summit, Google Cloud Summit 멕시코시티, Google Cloud Day 2026: Digital Broadcast(2026-10-28 온라인, 한국 대상 여부 미확인)
- 메모:
  - 교육·서포터즈라 뺐다: 2026 Google Student Ambassador(대학내일 주관, 모집 2026-06-22~07-05, 검색 근거), AI 올림 스킬링 프로그램(구글 포 코리아 2026 발표, 검색 근거)
  - 대학생 대상 "제미나이와 함께 성수에서"(블로그 2026-10-16)는 마케팅 행사로 보인다. 개발 행사인지 미확인이다
  - Google Cloud Day Seoul 2025는 2025-07-08 코엑스였다(검색 근거, 기간 밖). 2026 서울 회차는 미확인이다. 2024년 이름은 Google Cloud Summit Seoul이었다
  - Kaggle 상시 대회 수는 미확인이다(목록이 CSR, 검색 한도 소진)
  - 연간 주기: 구글 포 코리아 2024-09-30, 2025-07-02, 2026-04-29(검색 근거). 날짜가 매년 다르다

## Microsoft
- 조사 범위: 2026-10-23. 직접 요청 12회(robots 5, AI Tour 3, Imagine Cup 1, 뉴스 RSS 1, 약관 1, 404 포함). WebSearch 한도가 중간에 소진되어 모음 사이트 등장 여부와 한국어 웨비나는 확인하지 못했다.
- 공지 위치:
  - 공식 행사 사이트 `https://aitour.microsoft.com/` — 읽기: CSR / robots: robots 없음(`/robots.txt`가 JSON 500 "Could not find any robots file") / 루트가 `/flow/microsoft/aitour27/globallanding/page/globalhome`으로 간다. 제목이 "Microsoft Frontier Tour"로 바뀌었다. 도시 목록 `/flow/microsoft/aitour27/citydirectory`도 CSR이다. `/seoul`은 404다
  - 공식 행사 사이트 `https://imaginecup.microsoft.com/en-us` — 읽기: SSR / robots: robots 없음(`/robots.txt`가 403 오류 페이지로 리다이렉트) / "Imagine Cup 2027 - Coming Soon!", "2026 Imagine Cup Semifinalists", "Top Launch 2026" 카드. 날짜가 없다
  - 기술 블로그 RSS `https://news.microsoft.com/ko-kr/feed/` — 읽기: 공식 API·RSS / robots: 허용. 첫 줄 `Crawl-delay: 10`(User-agent 그룹 밖) / 최신 글이 2025-08-19다. 이후 갱신이 없다. 10건 중 행사 글은 Build 2025(해외) 1건
  - 이벤트 목록 페이지 `https://events.microsoft.com/` — 읽기: 미확인 / robots: robots 없음(JSON 500, AI Tour와 같은 응답) / 목록은 받지 않았다
- 약관: `https://www.microsoft.com/ko-kr/legal/terms-of-use`(→ en-us로 리다이렉트, "Last Updated: February 7, 2022"). 로봇·크롤링 조항은 없다. "Unless otherwise specified, the Services are for your personal and non-commercial use. You may not modify, copy, distribute, transmit, display, perform, reproduce, publish … any information … obtained from the Services."
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 3건, 후원 발견 0건
  - Microsoft Startup Connection 2026 — 2026-03-25 — 스타트업 대상 행사(형식 미확인) — 국내(서울 모스 스튜디오) — 주최 — 모음 사이트: 미확인 — 근거: 검색 근거 `https://www.digitaltoday.co.kr/cn/view/27242/microsoft-ai-tour-seoul-to-be-held-on-march-26-to-share-ai-adoption-cases-by-frontier-companies`
  - Microsoft AI Tour Seoul 2026 — 2026-03-26 — 컨퍼런스(실습 워크숍 포함) — 국내(코엑스) — 주최 — 모음 사이트: 미확인 — 근거: 검색 근거 `https://microsoft.github.io/mwkorea/monthlycopilot/AITourSeoul/`, 위 디지털투데이 기사. 공식 `/seoul` 페이지는 404다
  - Imagine Cup 2026 — 날짜 미확인(2026 시즌 진행은 공식 사이트에서 확인) — 공모전 — 온라인 제출 — 주최 — 모음 사이트: 미확인 — 근거: 직접 확인 `https://imaginecup.microsoft.com/en-us`. 한국 참가 자격은 미확인
- 예정(2026-11 이후):
  - Microsoft AI Tour: Seoul — 2027-04-14 — 컨퍼런스 — 국내 — 주최 — 근거: GitHub 이벤트 목록 APAC 필터 `https://github.com/resources/events?region=apac`(GitHub 항목 조사 중 직접 확인). aitour.microsoft.com 도시 목록은 CSR이라 확인하지 못했다
  - Imagine Cup 2027 — "Coming Soon", 날짜 미확인
- 해외 현장·생중계 행사(세지 않음): Microsoft Build 2026, Microsoft Ignite, Imagine Cup World Championship
- 메모:
  - AI Tour 2025 서울은 2025-03-26 aT센터였다(검색 근거, 기간 밖). 매년 3월 서울 개최다
  - 한국어 웨비나, Microsoft Reactor, AI Skills Fest는 검색 한도 소진으로 전수 조사하지 못했다
  - GitHub 항목 조사 중 보인 것(세지 않음): Microsoft Reactor "Let's Learn GitHub Copilot App (한국어)" 2026-07-21 라이브(검색 근거 `https://developer.microsoft.com/ko-kr/reactor/series/S-1689/`). 학습 시리즈라 웨비나·교육 구분이 미확인이다. 토크아이티 웨비나 "GitHub Copilot과 Agentic AI 시대의 개발 전략"(2026-06-18 추정, 에쓰핀테크놀로지·한국마이크로소프트 공동, 검색 근거 `https://www.hellot.net/mobile/article.html?no=113183`). 날짜가 추정이라 세지 않았다
  - 한국 뉴스룸 RSS는 2025-08 이후 멈췄다. 행사 공지는 LinkedIn·뉴스레터(`microsoft.github.io/mwkorea`)에서 보였다

## Apple
- 조사 범위: 2026-10-23. 직접 요청 9회(robots 2, 행사 허브·목록 4, SSC 1, RSS 1, 약관 1). Apple Developer Academy는 교육 프로그램이라 뺐다. WebSearch 한도 소진 전 Apple 검색은 하지 못했다.
- 공지 위치:
  - 이벤트 목록 페이지 `https://developer.apple.com/kr/events/` — 읽기: SSR / robots: 허용 / Meet with Apple 허브다. 추천 워크숍·그룹 랩 몇 건(예: iPhone Duo 그룹 랩 10월 13·15일 태평양 시간)만 있다
  - 이벤트 목록 페이지 `https://developer.apple.com/events/view/upcoming-events/` — 읽기: CSR / robots: 허용 / 원본 HTML에 제목 "Schedule - Meet with Apple"과 번들 JS만 있다. `/kr/events/view/upcoming-events/`는 404다
  - 이벤트 목록 페이지 `https://developer.apple.com/kr/events/developer-centers/` — 읽기: SSR / robots: 허용 / Developer Center는 벵갈루루·쿠퍼티노·싱가포르·상하이다. 서울은 없다. 2026-06-03 공지로 베를린이 5번째다
  - 공식 행사 사이트 `https://developer.apple.com/kr/swift-student-challenge/` — 읽기: SSR / robots: 허용 / 접수 기간이 없다. 뉴스룸 기사 목록(최근 2026-05-07)만 있다
  - 기술 블로그 RSS `https://developer.apple.com/news/rss/news.rss` — 읽기: 공식 API·RSS / robots: 허용 / 149건. SSC 접수 공지, WWDC 날짜 공지, 매월 "Hello Developer"가 올라온다
- 약관: `https://www.apple.com/kr/legal/internet-services/terms/site.html`(2009-11-20 업데이트, 개발자 사이트 바닥글이 링크). "'딥 링크', '페이지 스크랩', '로봇', '스파이더' 또는 기타 자동 기기 … 를 사용하여 사이트 또는 콘텐츠의 일부에 접근하거나 이를 취득, 복사 또는 모니터링 … 해서는 안 됩니다." 회원 여부와 관계없이 사이트 이용자 전체에 적용된다.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - Swift Student Challenge 2026 — 2026-02-06~02-28(제출) — 공모전 — 온라인 제출 — 주최 — 모음 사이트: 미확인 — 근거: 직접 확인 `https://developer.apple.com/news/?id=f0xw4t5r`(RSS 항목 "Submissions are now open through February 28")
- 예정(2026-11 이후): 미확인. SSC 2027 공지는 RSS에 아직 없다.
- 해외 현장·생중계 행사(세지 않음): WWDC26(2026-06-08~12), Apple Developer Center 세션(벵갈루루·쿠퍼티노·싱가포르·상하이)
- 메모:
  - 한국 현장 또는 한국어 온라인 Meet with Apple 세션 여부는 미확인이다. 전체 일정이 CSR이고 검색 한도가 소진됐다
  - 연간 주기: SSC 접수는 매년 2월(2025는 2월 23일 마감, 2026은 2월 28일 마감, RSS 직접 확인)

## Meta
- 조사 범위: Meta for Developers, developer.meta.com(llama.com 리다이렉트 대상), Meta 뉴스룸(about.fb.com), facebook.com robots. 검색 1회("Meta Llama 해커톤 서울 2026"). PyTorch는 Linux Foundation 소속이라 보지 않았다.
- 공지 위치:
  - 이벤트 목록 페이지 — 찾지 못했다. 국내 행사 공지 채널 미확인
  - 공식 행사 사이트 `https://developers.facebook.com` — 읽기: 미확인(행사 목록 페이지를 찾지 못함) / robots: 허용(`*` `Allow: /`) / robots 주석에 "Collection of data on Facebook through automated means is prohibited unless you have express written permission from Meta"가 있다
  - 공식 행사 사이트 `https://www.llama.com` — `developer.meta.com`으로 301 리다이렉트한다 / robots: 허용(`*`는 `/ajax/`, `/login/`, `/*.php` 등만 금지) / 같은 자동 수집 금지 주석이 있다
  - 기술 블로그 RSS `https://about.fb.com/ko/feed/`, `https://about.fb.com/ko/news/feed/` — 읽기: 불가 / robots: 허용 / 둘 다 `about.facebook.com/ko/` → `www.meta.com/ko-kr/about/`로 리다이렉트된다. 한국어 뉴스룸 피드가 없다
  - SNS: 미확인
- 약관: 미확인. robots가 가리키는 Automated Data Collection Terms(`https://www.facebook.com/legal/automated_data_collection_terms`)는 `facebook.com` robots가 `*` `Disallow: /`라서 받지 않았다. robots 주석 요지는 "서면 허가 없는 자동 수집 금지"다
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건, 후원 발견 0건
  - 국내 행사를 찾지 못했다(검색 1회 근거). 미확인(검색 한도)
- 예정(2026-11 이후): 찾지 못했다
- 해외 현장·생중계 행사(세지 않음): LlamaCon(2025-04-29, 미국, 기간 밖), Llama Impact Hackathon(샌프란시스코)
- 메모: 한국 대상 개발자 행사 공지 채널을 찾지 못했다. Meta 계열 호스트는 모두 robots 주석으로 자동 수집 금지를 알린다

## NVIDIA
- 조사 범위: nvidia.com robots·한국 행사 페이지·AI Day Seoul·웨비나 포털·약관, NVIDIA 한국 블로그 robots·RSS. 검색 2회("NVIDIA AI Day Seoul 2026", "AI Day Seoul 2025")
- 공지 위치:
  - 공식 행사 사이트 `https://www.nvidia.com/ko-kr/ai-days/` — 읽기: SSR(단일 행사) / robots: 허용 / `<title>` "AI Day Seoul 2026", 본문 "2026년 11월 9~10일 | 코엑스", "AI Day Seoul 정원이 모두 마감되어 등록이 종료되었습니다". 지난 회차 아카이브 링크는 없다
  - 이벤트 목록 페이지 `https://www.nvidia.com/ko-kr/events/` — 읽기: CSR / robots: 허용 / `<title>` "NVIDIA Corporate and Investor Events Calendar". 본문에 "This site requires Javascript"만 있다. 스크립트에 `https://api-prod.nvidia.com/search/graphql`가 보이나 호출하지 않았다(GraphQL, 다른 호스트 robots 미확인)
  - 이벤트 목록 페이지 `https://www.nvidia.com/en-us/about-nvidia/webinar-portal/` — 읽기: CSR / robots: 허용 / 한국 사이트 바닥글 "웨비나" 링크가 가리키는 글로벌 페이지다. HTML에 Korea·APJ·APAC 웨비나가 없다
  - 기술 블로그 RSS `https://blogs.nvidia.co.kr/feed/` — 읽기: 공식 API·RSS / robots: 허용 / 10건(2026-10-19~23) 중 국내 행사 공지 0건
  - 모음 사이트 `https://discuss.pytorch.kr/t/nvidiaaiday-seoul-2026/12168` — PyTorch 한국 사용자 모임 포럼에 AI Day Seoul 2026 글이 있다(검색 근거). 요청하지 않았다
- 약관: `https://www.nvidia.com/ko-kr/about-nvidia/terms-of-service/`(마지막 수정 2024-02-05). 금지 행위 (f): "로봇, 스파이더, 스크레이퍼, 크롤러, 데이터 마이닝 도구 … 를 사용하여 사이트의 일부라도 액세스, 획득, 복사하거나 모니터링하는 행위". (a) "상업적 목적 또는 공개 전시 … 의 목적으로 사용하는 행위"도 금지다. robots는 `Content-Signal: ai-train=yes, search=yes, ai-input=yes`로 약관과 결이 다르다
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - AI Day Seoul 2025 — 2025-11-17~18 — 컨퍼런스(17일 DLI 핸즈온 워크숍, 18일 본 행사) — 국내(코엑스) — 주최 — 모음 사이트: 미확인(검색 한도) — 근거: 검색 근거 `https://www.khan.co.kr/article/202511181503507`, `https://blogs.nvidia.com/blog/ai-day-seoul`. 기사는 "2019년 이후 6년 만의 국내 대규모 개발자 컨퍼런스"라고 적었다
- 예정(2026-11 이후):
  - AI Day Seoul 2026 — 2026-11-09~10 — 컨퍼런스(11-09 세션 15개, 11-10 DLI 핸즈온 워크숍·스페셜 이벤트) — 국내(코엑스) — 주최 — 모음 사이트: discuss.pytorch.kr(검색 근거), 그 외 미확인(검색 한도) — 근거: `https://www.nvidia.com/ko-kr/ai-days/`(직접 확인). 등록 마감
  - 같은 페이지의 "Agentic AI 10x Bootcamp — Community Day"(11-10): "국내 AI 및 개발자 커뮤니티 10곳과 패스트캠퍼스가 공동 주최한 Agentic AI 해커톤" 결선 쇼케이스다. 해커톤 본선 날짜와 NVIDIA의 역할(주최·후원)은 미확인이다
- 해외 현장·생중계 행사(세지 않음): GTC(미국 등). 한국어 세션 여부 미확인
- 메모: 국내 대표 행사는 AI Day Seoul이다. 2025-11, 2026-11로 연 1회 11월 개최다(2025는 검색 근거). 행사 목록 페이지와 웨비나 포털은 CSR이다. 한국 블로그 RSS에 행사 공지가 실리는지는 10건만 봐서 미확인이다. Inception Grand Challenge(스타트업 100곳 지원, 결선 5곳이 AI Day Seoul 2025에서 발표, 중기부 장관상)가 있었다(검색 근거). 접수 기간과 주최 구조가 미확인이라 세지 않았다

## OpenAI
- 조사 범위: openai.com robots·행사 경로·뉴스 RSS·약관, OpenAI Academy robots·공개 행사 목록. 검색 1회("OpenAI 서울 해커톤 2026")
- 공지 위치:
  - 이벤트 목록 페이지 `https://openai.com/events/` — 읽기: 불가 / robots: 허용(`*` `Allow: /`, `/microsoft-for-startups/`만 금지) / 403 Cloudflare 확인 화면(`cf-mitigated: challenge`). 우회하지 않았다. 해당 경로에 목록이 있는지도 미확인이다
  - 기술 블로그 RSS `https://openai.com/news/rss.xml` — 읽기: 공식 API·RSS / robots: 허용 / 1,316건(2015-12~2026-10-23). 행사 글은 드물다("DevDay 2026 Recap" 2026-09-29). 한국 관련 글은 2025-10 이전 4건뿐이고 국내 행사 공지는 0건이다
  - 이벤트 목록 페이지 `https://academy.openai.com/public/events` — 읽기: SSR(`__NEXT_DATA__`도 있다) / robots: 허용(`Disallow: /events`는 `/public/events`와 경로가 다르다) / 라이브스트림·웨비나 목록이다. Korea·Seoul·KST 0건. 교육 성격이 강하다
- 약관: 미확인. `https://openai.com/policies/row-terms-of-use/`가 403 Cloudflare 확인 화면이다
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건(연도 미확인 1건 별도)
  - 멀티 에이전트 워크플로우 해커톤 — 2026-01-20 — 해커톤 — 국내(서울) — 주관(콕스웨이브와 공동 개최) — 모음 사이트: 미확인(검색 한도) — 근거: 검색 근거(검색 요약에 "콕스웨이브가 OpenAI와 공동 개최", "16개 팀 50명". 출처 기사 URL을 특정하지 못했다)
  - 연도 미확인: OpenAI Game Builders Seoul — 8-31 — Codex 게임 개발 해커톤 — 국내(서울) — 주최(컴투스 후원) — 모음 사이트: 미확인(검색 한도) — 근거: 검색 근거 `https://hellot.net/news/article.html?no=114177`, `https://byline.network/tag/openai/`. "오픈AI가 코덱스를 활용한 게임 개발을 주제로 여는 첫 프로그램"이다. 연도를 확인하지 못해 집계에 넣지 않았다
  - 연도 미확인: Conquer Health 해커톤 — 8-21~22 — 해커톤 — 국내 — 후원(루닛·디써클 주최, OpenAI는 참가자 전원에게 ChatGPT Pro 3개월 이용권 제공) — 모음 사이트: 미확인 — 근거: 검색 근거(출처 URL 특정 못함). 집계에 넣지 않았다
- 예정(2026-11 이후): 찾지 못했다
- 해외 현장·생중계 행사(세지 않음): DevDay 2026(RSS "DevDay 2026 Recap")
- 메모: 국내 행사는 파트너사와 공동 개최하거나 크레딧을 대는 형태로 보인다(검색 근거). 공식 사이트 행사 경로와 약관은 봇 UA에 막혀 있다. 공지는 기사·파트너 채널로 나온다(검색 근거)

## Anthropic
- 조사 범위: anthropic.com robots·행사 목록 1~2쪽·워크숍 목록·약관, claude.com robots·커뮤니티 행사 목록. 검색 1회("Anthropic Claude 서울 밋업 해커톤 2026")
- 공지 위치:
  - 이벤트 목록 페이지 `https://www.anthropic.com/events` — 읽기: SSR(Webflow) / robots: 허용 / 페이지 주소 `?939688b5_page=N`, 3쪽 중 1~2쪽을 봤다. 20건 중 Seoul·Korea 0건. 종류 필터(Partner·Startup·Enterprise·Anthropic)와 형식 필터(In-person·Virtual)가 있다
  - 이벤트 목록 페이지 `https://claude.com/community` — 읽기: SSR(첫 행) + 내장 데이터(`self.__next_f` RSC, 행 키 `communityEvent.evt-…`, Luma 링크·국가코드·도시·날짜) / robots: 허용 / 다가오는 커뮤니티 행사 약 74~80건 중 KR 0건, JP 12건
  - 이벤트 목록 페이지 `https://www.anthropic.com/events/build-with-claude` — 읽기: SSR / robots: 허용 / Claude 워크숍 목록이다. 교육 성격이다. 지역 필터의 APAC 도시는 Melbourne·Sydney뿐이다
  - 모음 사이트 `https://luma.com/elhey8nv` — Push to Prod SEOUL 신청 페이지(검색 근거). 요청하지 않았다
- 약관: `https://www.anthropic.com/legal/consumer-terms`(한국어, 시행 2025-10-08). "당사 서비스"에 관련 "웹사이트"가 들어간다. 금지: "본 약관에서 허용된 경우를 제외하고 당사 서비스에서 데이터 또는 정보를 크롤링(crawl), 스크래핑(scrape) 또는 다른 방식으로 수집", "Anthropic API 키를 통해 … 접속하거나 당사가 이를 명시적으로 허용하는 경우를 제외하고 봇(bot), 스크립트(script) … 를 통해 자동화된 … 방식을 통해 당사 서비스에 접속"
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - Push to Prod SEOUL — 날짜 미확인(1차 신청 마감 5-31, OT 2026-06-09) — 해커톤(Replit·Claude Code로 약 2시간 제품 빌드, 스타트업 대상) — 국내(서울) — 공동 주최(한국투자파트너스·한국투자액셀러레이터·Anthropic·Replit, NextRise 2026 공식 사이드 이벤트) — 모음 사이트: luma(검색 근거) — 근거: 검색 근거 `https://luma.com/elhey8nv`
- 예정(2026-11 이후): 공식 행사 목록·커뮤니티 목록에 국내 행사 없다
- 해외 현장·생중계 행사(세지 않음): Code with Claude(2026-05-06, 샌프란시스코), Code with Claude Tokyo(2026-06-10, 검색 근거), Tokyo Builder Summit(2025-10-28, 기간 밖), Claude Founder House(런던·파리·베를린·스톡홀름·SF), AWS re:Invent·Summit 부스 행사, The Briefing(영문 가상 행사)
- 메모: 서울 사무소는 2026년 초 개소 예정이라는 보도가 있다(검색 근거 `https://www.investmentmonitor.ai/?p=125702`). 공식 목록·커뮤니티 목록 모두 한국 행사가 없다. 국내 Claude 커뮤니티 밋업의 과거 개최는 미확인(검색 한도)이다

## Cursor(Anysphere)
- 조사 범위: cursor.com robots·행사 경로·커뮤니티 페이지·약관, forum.cursor.com robots·이벤트(Asia) 카테고리, luma.com robots·서울 캘린더. 검색 6회
- 공지 위치:
  - 이벤트 목록 페이지 `https://cursor.com/community` — 읽기: SSR(제목·연도 없는 날짜 "Mon, Oct 26"·호스트·도시·Luma 링크) + 내장 데이터(`self.__next_f`, `platform:"luma"`, `start_at`, `country_code`, `calendar_name`) / robots: 허용 / 전 세계 다가오는 행사 89건(2026-10~2027-02) 중 KR 2건
  - 이벤트 목록 페이지 `https://cursor.com/events` — 307 → `https://luma.com/cursor` → 302 → `https://luma.com/spacexsi`. Luma 캘린더로 보낸다
  - 이벤트 목록 페이지 `https://forum.cursor.com/c/events/asia/25` — 읽기: SSR(Discourse 크롤러용 HTML) / robots: 허용(`/c/*.rss`, `/t/*/*.rss`는 금지) / "New event: Grok Bot Meetup Seoul"(2026-10-06 글) 등 행사별 글이 올라온다
  - 모음 사이트 `https://luma.com/spacexai-seoul` — 읽기: 내장 데이터(EVENT_SITES 기준 Luma와 같다. `__NEXT_DATA__`) / robots: `*` 그룹 없음(Googlebot 그룹만) / 캘린더 이름 "SpaceXAI for Seoul, South Korea", 인스타그램 `cursorkorea`. 예정 2건. 약관은 EVENT_SITES 기준 "공개 인터페이스 외 접근 금지"
  - SNS: Instagram `https://www.instagram.com/cursorkorea/`(URL만)
- 약관: `https://cursor.com/terms-of-service`(Last updated 2026-09-03). "Service"에 "the website www.cursor.com"이 들어간다. 금지: "(viii) harvest, scrape, or extract data from the Service". Grok Bot 이용은 별도 "Grok Bot Terms"를 따른다고 적었다
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 4건, 후원 발견 0건
  - Cursor Hackathon Seoul — 2026-02-07 10:00 KST — 해커톤 — 국내(강남 제니스타워, 장소는 검색 근거) — 주최(Cursor 서울 커뮤니티 호스트) — 모음 사이트: luma — 근거: `https://luma.com/2s524ldj`(직접 확인, `start_at` 2026-02-07T01:00Z)
  - Cursor Hackathon Seoul 3rd(커서 해커톤 서울 vol.3) — 2026-06-27 11:00 KST — 해커톤 — 국내(서울 AI 허브) — 공동 주최(서울 AI 허브와 Cursor 국내 공식 빌더 커뮤니티 Team Human, 검색 근거) — 모음 사이트: luma — 근거: `https://luma.com/6y8qjtgr`(직접 확인), `https://www.mt.co.kr/article/2026061911443660377`(검색 근거, 참가 166명)
  - Cursor Seoul: Trainthon — 2026-09-08~10 — 밋업(세부 종류 미확인) — 국내(강릉 스카이베이호텔 경포) — 주최 — 모음 사이트: 미확인(검색 한도) — 근거: 검색 근거 `https://vibecoding.app/events/cursor-seoul-trainthon-2026-09`
  - Grok Bot Meetup Seoul — 2026-10-26 11:00 KST — 밋업 — 국내(서울) — 주최(Cursor 커뮤니티 페이지·포럼에 등록) — 모음 사이트: luma — 근거: `https://cursor.com/community`, `https://luma.com/spacexai-seoul`, `https://forum.cursor.com/c/events/asia/25`(직접 확인)
- 예정(2026-11 이후):
  - Grok Bot Seoul Build Day — 2026-11-01 10:30 KST — 종류 미확인(이름은 빌드 데이) — 국내(서울) — 주최 — 모음 사이트: luma — 근거: `https://luma.com/spacexai-seoul`(직접 확인)
- 해외 현장·생중계 행사(세지 않음): 해외 Grok Bot 밋업·해커톤 다수(도쿄·오키나와·마카오 등)
- 메모: 공지는 공식 커뮤니티 페이지·포럼·Luma에 함께 나온다. 서울 행사는 커뮤니티 앰배서더가 연다(호스트 Dave·SIREAL·가온 등). 2026-10 이후 행사 이름과 캘린더 이름이 "Grok Bot"·"SpaceXAI"로 바뀌었다. 바뀐 이유는 미확인이다. vol.1 날짜는 미확인이다. Cursor Meetup Seoul(해시드라운지, `luma.com/cursor_seoul_250614`)은 URL에 250614가 들어 있다. 날짜는 미확인이다(검색 근거). `luma.com/2s524ldj`, `luma.com/6y8qjtgr`은 캘린더로 알고 요청했는데 개별 행사 페이지였다(규칙상 요청 대상이 아니었다)

## GitHub
- 조사 범위: robots 3곳(github.com, resources.github.com, docs.github.com), 이벤트 목록 1~2페이지, APAC 필터 1회, Connect Tour 허브, 이용 정책(AUP). 직접 요청 9회. WebSearch로 한국 행사·Game Off·Dev Days를 찾았다. 조사 중 세션 WebSearch 한도가 소진되어 모음 사이트 확인은 일부만 했다.
- 공지 위치:
  - 이벤트 목록 페이지 `https://github.com/resources/events` — 읽기: SSR(+ 내장 데이터) / robots: 허용(`*` 그룹에 `/resources/` 금지 없음) / `github.com/events`, `resources.github.com/events/` 모두 여기로 리다이렉트한다. 카드(이름·설명·장소·날짜·등록 링크)가 HTML에 있다. JSON-LD `CollectionPage`에도 이름·설명이 있다. `?page=N`(6페이지), `?region=apac` 필터가 서버에서 동작한다. 예정 행사만 보인다. ETag 있음, `cache-control: no-cache`
  - 공식 행사 사이트 `https://github.com/resources/events/github-connect-tour` — 읽기: SSR / robots: 허용 / 2026 도시: Melbourne·Auckland·Wellington(종료), Singapore 11-19, Bangkok 11-26, Shanghai 12-03. 서울 없음
  - 기술 블로그 RSS `https://github.blog/feed/` — 미확인(요청 안 함)
  - 모음 사이트 Luma — Copilot Dev Days 도시별 페이지가 Luma에 올라온다(검색 근거). 서울 페이지는 찾지 못했다
- 약관: GitHub Acceptable Use Policies `https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies`. 스크래핑 정보 사용을 연구·아카이브 목적만 열거한다.
  - "You may use information from our Service for the following reasons, regardless of whether the information was scraped …: Researchers … Archivists …"
  - "Scraping refers to extracting information from our Service via an automated process, such as a bot or webcrawler."
  - robots.txt 머리말: "If you would like to crawl GitHub contact us via https://support.github.com?tags=dotcom-robots"
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 1건, 후원 발견 0건
  - Game Off 2025(주제 WAVES) — 2025-11-01~12-01 — 해커톤(게임잼) — 온라인(itch.io, 누구나 참가) — 주최 — 모음 사이트: 미확인(검색 한도 소진) — 근거: 검색 근거(`https://github.blog/company/github-game-off-2025-theme-announcement/`, itch.io 기간 표기)
- 예정(2026-11 이후):
  - Game Off 2026 — 2026-11 — 해커톤(게임잼) — 온라인 — 주최 — 근거: `https://github.com/resources/events?page=2`
- 해외 현장·생중계 행사(세지 않음): GitHub Universe 2026(SF·온라인 생중계, 10-28~29), Universe 2026 Ticket Giveaway, GitHub Universe on the Road(Sydney 11-17, Toronto 11-18, Bengaluru 12-01), Agentic Day(NYC·Chicago·Montréal·Boston), GitHub Connect Tour(Singapore·Bangkok·Shanghai 등), Copilot Dev Days(커뮤니티 주도·GitHub 지원, 2026-03~04와 09~10 글로벌. 서울 회차 찾지 못함, 검색 근거), Microsoft Ignite 2026
- 메모:
  - 영어 온라인 웨비나가 이벤트 목록에 섞인다(파트너 공동 개최 다수). APJ 시간대 영어 웨비나 예: "Agent Quality & Token Optimisation"(Insight·GitHub, 2026-10-21 12PM AEDT). 한국어 웨비나는 목록에서 찾지 못했다. 세지 않았다.
  - 한국어 GitHub 주제 행사는 Microsoft 쪽에서 열린다: Microsoft Reactor "Let's Learn GitHub Copilot App (한국어)" 2026-07-21 라이브(검색 근거, `https://developer.microsoft.com/ko-kr/reactor/series/S-1689/`). 주최가 Microsoft Reactor라서 GitHub 건수에 넣지 않았다. Microsoft 묶음과 겹친다.
  - 토크아이티 웨비나 "GitHub Copilot과 Agentic AI 시대의 개발 전략"(2026-06-18 추정, 에쓰핀테크놀로지·한국마이크로소프트 공동, 검색 근거 `https://www.hellot.net/mobile/article.html?no=113183`). GitHub 주최 아님.
  - 서울 Universe 리캡은 2024-12-06 "Microsoft-GitHub UNIVERSE24 Recap Seoul"만 찾았다(검색 근거). 2025 리캡 서울 개최 여부는 미확인.
  - GitHub 이벤트 목록 APAC 필터에 "Microsoft AI Tour: Seoul" 2027-04-14가 실려 있다(Microsoft 행사).

## Databricks
- 조사 범위: robots, 이벤트 목록(한국어·영어), Gatsby page-data 1회(404), Data + AI World Tour 허브, AI Days 허브, 웹사이트 이용약관. 직접 요청 7회. WebSearch는 1회("Data + AI World Tour 서울 2025")만 했다. 그 뒤 한도가 소진됐다.
- 공지 위치:
  - 이벤트 목록 페이지 `https://www.databricks.com/kr/events` — 읽기: 추천·온디맨드 블록은 SSR, "다가오는 이벤트" 캘린더는 CSR / robots: 허용(`User-agent: *` `Allow: /`) / 캘린더 자리가 원본 HTML에서 "Loading..."이다. `/page-data/kr/events/page-data.json`은 404. 추천 블록에 "Data + AI 러닝 페스티벌 2026"(1-Day 실습 교육)이 있다. 아시아-태평양 필터 링크 `?event_type=all&region=아시아-태평양&lang=kr`. ETag·Last-Modified 있음(Cloudflare)
  - 공식 행사 사이트 `https://www.databricks.com/kr/dataaisummit/worldtour` — 읽기: SSR(+ 내장 데이터: 도시별 Drupal 노드 JSON) / robots: 허용 / 2026 도시 카드에 날짜·오프라인/버추얼·종료 여부가 있다. 서울 오프라인 없음. "Virtual Korea" 2027-01-21 "곧 출시 예정"(노드 생성 2026-10-12)
  - 공식 행사 사이트 `https://www.databricks.com/kr/ai-days` — 읽기: SSR / robots: 허용 / 38개 도시 목록에 서울이 있다
  - SNS: YouTube(온디맨드 안내 링크) — URL만
- 약관: Website Terms of Use `https://www.databricks.com/legal/terms-of-use`(Last Updated May 25, 2018). 방문자 전체 대상이다.
  - "Use any robot, spider, crawler, scraper, … or other manual or automated device, program, algorithm or methodology or interface not provided by us to access, acquire, copy, retrieve, index, scrape, data mine … or to extract data …"
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 2건, 후원 발견 0건
  - Data + AI World Tour Seoul, Virtual — 2025-12-11 — 온라인 컨퍼런스 — 온라인(한국 대상 버추얼) — 주최 — 모음 사이트: 미확인(검색 한도) — 근거: 검색 근거(Databricks 투어 목록 "Seoul, Virtual December 11, 2025 This event has ended", `https://www.databricks.com/resources/webinar/data-ai-world-tour-asia-pacific-virtual-2025`). 같은 날짜가 APJ 버추얼로도 표기돼 한국어 회차인지는 미확인이다
  - Databricks AI Days 서울 — 2026-04-01 — 컨퍼런스(기조연설·고객 사례·핸즈온) — 국내 — 주최 — 모음 사이트: 미확인(검색 한도 소진) — 근거: `https://www.databricks.com/kr/ai-days`
- 예정(2026-11 이후):
  - Data + AI World Tour Virtual Korea — 2027-01-21 — 온라인 컨퍼런스 — 한국 대상 버추얼 — 주최 — 근거: `https://www.databricks.com/kr/dataaisummit/worldtour`. 같은 날 Virtual APJ도 있다
- 해외 현장·생중계 행사(세지 않음): Data + AI Summit(미국), Data + AI World Tour 2026(Singapore·Sydney·Mumbai 종료, Tokyo 11-27, 북미·유럽 다수), AI Days(Hong Kong·Kuala Lumpur·Melbourne 등)
- 메모:
  - "Data + AI 러닝 페스티벌 2026"(상반기 온라인, 7월 웨비나 `/kr/resources/webinar/databricks-kr-learning-festival-july2026`)은 실습 교육이라 세지 않았다.
  - NAMED_ORGS의 "Data + AI World Tour Seoul"은 2026 도시 목록에 없다. 2025에도 서울 현장 회차는 없고 버추얼(2025-12-11)만 있었다(검색 근거). 2025 아시아 현장은 Singapore·Mumbai·Sydney·Tokyo였다(검색 근거).
  - 주기: World Tour 한국 버추얼이 2025-12, 2027-01(예정)이다. AI Days 서울은 2026-04다.
  - 한국어 웨비나 건수는 미확인이다. 캘린더가 CSR이고 검색을 못 했다.
  - 해커톤 개최 여부는 미확인이다.

## Snowflake
- 조사 범위: robots, 한국어 이벤트 페이지, 전체 이벤트 목록(APJ 필터 링크), World Tour 서울·Data for Breakfast 서울 행사 사이트, BUILD 링크(Expedition으로 리다이렉트), Site Terms. 직접 요청 7회. WebSearch는 한도 소진으로 못 했다.
- 공지 위치:
  - 이벤트 목록 페이지 `https://www.snowflake.com/ko/events/` — 읽기: SSR / robots: 허용(`*` `Allow: /`. AEM 시스템 경로, `/feed/`, `/wp-json/` 금지) / 한국어 추천 카드 3개(World Tour 서울, Data for Breakfast, BUILD)가 HTML에 있다. 행사가 끝난 뒤에도 "지금 등록하기"가 남아 있다. Last-Modified 있음, `max-age=900`
  - 이벤트 목록 페이지 `https://www.snowflake.com/en/events/all-events/` — 읽기: SSR / robots: 허용 / "16 Results" 중 1페이지 9건이 HTML에 있다. `?tags=region%2Fapj`를 붙여도 서버 응답은 같은 글로벌 목록이다(필터는 브라우저에서 적용). 예정 행사만 보인다. AEM `all-events.model.json` 링크가 있다(호출 안 함)
  - 공식 행사 사이트 `https://www.snowflake.com/ko/world-tour/seoul/` — 읽기: SSR / robots: 허용 / 날짜·시간·장소가 HTML에 있다
  - 공식 행사 사이트 `https://www.snowflake.com/events/data-for-breakfast/seoul/` — 읽기: SSR / robots: 허용 / "사전등록은 마감 되었습니다" 문구가 있다
  - 공식 행사 사이트 `https://www.snowflake.com/en/expedition/` — 읽기: SSR / robots: 허용 / `/en/build/`가 여기로 리다이렉트된다. 지역 스트림 목록에 Korea가 있다
- 약관: Snowflake Site Terms `https://www.snowflake.com/en/legal/snowflake-site-terms/`(Last Updated: April 14, 2025).
  - 이용 허락: "solely for your personal, non-commercial use"
  - 금지: "(i) use any manual or automated software, devices or other processes (including but not limited to spiders, robots, scrapers, crawlers, …) to “scrape”, “deep-link”, copy, monitor or download any portion of the Site or Materials …"
  - 금지: "(c) reuse, re-post, distribute, transmit, disseminate … the Materials, in whole or in part"
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 2건, 후원 발견 0건
  - Snowflake World Tour 서울 — 2026-08-27 — 컨퍼런스 — 국내(코엑스 컨퍼런스센터) — 주최 — 모음 사이트: 미확인(검색 한도 소진) — 근거: `https://www.snowflake.com/ko/world-tour/seoul/`
  - Data for Breakfast 서울 — 2026-03-19 — 세미나 — 국내(앰배서더 서울 풀만) — 주최 — 모음 사이트: 미확인(검색 한도 소진) — 근거: `https://www.snowflake.com/events/data-for-breakfast/seoul/`
- 예정(2026-11 이후):
  - EXPEDITION 2026 Korea 스트림 — 2026-11-04~06 — 온라인 컨퍼런스 — 한국 대상 지역 스트림(언어 미확인) — 주최 — 근거: `https://www.snowflake.com/en/expedition/`
- 해외 현장·생중계 행사(세지 않음): Snowflake Summit 26(SF, 2026-06-01~04), Summit 27(2027-06-07~10), World Tour 2026 해외 도시(Ciudad de México·New York·Paris·Santiago·Rotterdam 등), Snowflake Forum Zurich, Helsinki Data Week 핸즈온 랩, AWS re:Invent 부스
- 메모:
  - BUILD 2026(2026-01~02, "가상 및 오프라인 글로벌 이벤트", 온디맨드 제공)의 한국 회차 여부는 미확인이다. 2026 하반기 개발자 행사는 이름이 EXPEDITION으로 바뀐 것으로 보인다(`/en/build/` 리다이렉트).
  - Expedition 페이지에 "Snowflake Startup Challenge 2027"이 있다. 한국 참가 가능 여부는 미확인이다.
  - Data for Breakfast는 "전 세계 100+ 이벤트, 2026년 3~4월"로 연 1회 도시 순회다.
  - 한국어 웨비나 건수는 미확인이다.

## Hugging Face
- 조사 범위: robots, `/events` 경로, 블로그 RSS, Competitions 페이지, 이용약관. 직접 요청 5회. WebSearch는 한도 소진으로 못 했다.
- 공지 위치:
  - 이벤트 목록 페이지 없음. `https://huggingface.co/events`는 사용자 조직 `https://huggingface.co/Events`(회원 1명, HF 공식 아님)로 리다이렉트된다
  - 기술 블로그 RSS `https://huggingface.co/blog/feed.xml` — 읽기: 공식 RSS / robots: 허용(`User-agent: *` `Allow: /`) / 전체 889건이 한 번에 온다. description이 비어 있다. 2025-11 이후 행사 글은 "Join the AMD Open Robotics Hackathon"(2025-11-13, `/blog/amd/` 파트너 글) 1건이다
  - 이벤트 목록 페이지 `https://huggingface.co/competitions` — 읽기: SSR(조직 카드 마크다운이 HTML에 있다) / robots: 허용 / 표의 마감일이 2024~2025-02다. 갱신이 멈췄다. 주최는 제3자(RadNLP, Shanghai AI Lab 등)다
  - SNS: X·LinkedIn·Discord — URL만(요청 안 함)
- 약관: Terms of Service `https://huggingface.co/terms-of-service`(Effective Date: September 15, 2022). 자동 수집·재배포 금지 조항을 찾지 못했다(없음). Content는 "subject to these Terms and/or the terms accompanying such Content"다. Content Policy 원문은 미확인이다.
- 최근 12개월 행사(2025-11~2026-10): 주최·주관 0건 확인, 후원 발견 0건
  - 국내 행사: 미확인(검색 한도 소진)
  - AMD Open Robotics Hackathon — 2025-11 공지 — 해커톤 — 장소 미확인 — AMD 글, HF 역할 미확인 — 모음 사이트: 미확인 — 근거: `https://huggingface.co/blog/amd/openroboticshackathon`(RSS 제목만 확인)
- 예정(2026-11 이후): 찾지 못함
- 해외 현장·생중계 행사(세지 않음): 미확인
- 메모:
  - 공식 행사 공지 채널이 없다. 블로그 RSS에 행사 글이 드물다(889건 중 hackathon·challenge·competition·game jam 등 키워드 제목 9건, 2025-11 이후는 1건).
  - Competitions는 HF가 플랫폼만 제공한다. HF 주최 행사가 아니다.
  - 한국 커뮤니티(HF KREW 등)와 서울 밋업은 이 묶음에서 확인하지 못했다.

## 묶음 요약
- 국내 행사 0건: Meta, GitHub, Hugging Face다. Apple은 온라인 제출 대회(Swift Student Challenge) 1건뿐이다. Anthropic·OpenAI는 파트너와 공동 개최한 서울 해커톤 1건씩이다.
- 국내 행사가 꾸준한 주최: AWS(Summit 5월·Games on AWS 10월 등), Google(구글 포 코리아·Cloud 한국 행사), Microsoft(AI Tour Seoul 3월), NVIDIA(AI Day Seoul 11월), Snowflake(World Tour 서울 8월·Data for Breakfast 3월), Databricks(AI Days 서울 4월). Cursor는 커뮤니티 앰배서더가 서울 해커톤·밋업을 연다.
- 읽기 불가·CSR: OpenAI `openai.com/events`와 약관은 Cloudflare 확인 화면(403)이다. NVIDIA·Databricks 행사 캘린더, Apple 전체 일정, AI Tour 도시 목록, AWS Startups 행사, Kaggle은 CSR이다. Meta·Hugging Face는 공식 행사 목록이 없다.
- 약관: AWS·Apple·NVIDIA·Databricks·Snowflake·Anthropic·Cursor가 봇·스크래핑을 명시 금지한다. Meta는 robots 주석으로 금지한다. Google은 robots 위반 자동 접근만 금지한다. Hugging Face는 조항이 없다.
- 모음 사이트: 대부분 거의 안 올라온다. 확인된 것은 Cursor·Anthropic(Luma), Games on AWS 2026(이벤터스, 대행사 채널), NVIDIA AI Day(PyTorch 한국 포럼)뿐이다. 검색 한도 소진으로 모음 사이트 확인을 못 한 주최가 많다.
