# 묶음 education — 교육 프로그램 8곳

조사 날짜: 2026-10-25 16:01~16:22 KST(한국 시간). 기간: 2025-11-01 ~ 2026-10-31. WebSearch 22회. 직접 요청 67회(`news.samsung.com` 재시도 1회 포함).

공통 메모:

- 봇 UA로만 요청했다. 같은 호스트는 1.1초 이상 간격을 뒀다. 페이지보다 robots.txt를 먼저 받았다.
- 받는 기준은 NAMED_ORGS.md "추가 결정 (2026-10-25)"을 따랐다. 모집 공고와 교육 프로그램이 여는 해커톤·데모데이·성과 발표회·설명회를 셌다. 채용설명회·입학식·수료식은 세지 않고 메모에 적었다.
- 모집 기간이 기간 경계에 걸치면 셌다(예: SSAFY 15기 2025-10-27~11-10).
- 모음 사이트 칸은 검색 결과에 우연히 보인 것만 적었다. 모음 사이트를 찾으려는 검색은 하지 않았다. "모음 사이트: 미확인"은 찾아봤는데 없다는 뜻이 아니다.
- "(재조사)"가 붙은 칸은 같은 날 재조사([NAMED_ORGS_SURVEY.md](../NAMED_ORGS_SURVEY.md) "재조사 결과" 절)에서 모음 사이트 7곳을 찾아본 결과다. 이벤터스·ticketa·OKKY·위비티는 사이트 검색을 직접 받아 봤고, Luma·Meetup·링커리어는 검색 근거다.
- 날짜를 슬러그나 제목 숫자로 읽은 곳은 그렇게 적었다.

## SSAFY(삼성 청년 SW·AI 아카데미)

- 조사 범위: `www.ssafy.com` 공지사항·SSAFY 소식 게시판·이용약관. 삼성전자 뉴스룸은 접속하지 못했다.
- 공지 위치:
  - 공식 사이트 `https://www.ssafy.com/` — 읽기: 불가(JS 리다이렉트 껍데기) / robots: 허용(`/data/`, `/*.pdf$`만 금지) / 3.7KB. NetFunnel 대기열 스크립트가 `/ksp/servlet/swp.main.controller.SwpIntroServlet`로 보낸다. 본문 없음
  - 공지 목록 `https://www.ssafy.com/ksp/servlet/swp.board.controller.SwpBoardServlet?p_process=select-board-list&p_param1=226504` — 읽기: SSR / robots: 허용 / 제목·날짜가 HTML에 있다. 첫 페이지 10건(2026-04-13~10-12). 모집공고·모집설명회·전형 결과가 여기 올라온다. 메뉴는 JS `fnGoNotice()` 폼 전송이지만 GET으로도 같은 목록이 온다
  - 공지 상세 `https://www.ssafy.com/ksp/servlet/swp.board.controller.SwpBoardServlet?p_process=select-board-view&p_param1=226504&p_receipt_seq=189` — 읽기: SSR / 본문 전체가 HTML에 있다
  - SSAFY 소식 `https://www.ssafy.com/ksp/servlet/swp.board.controller.SwpBoardServlet?p_process=select-board-list&p_menu_cd=M0202&p_param1=226507` — 읽기: SSR / robots: 허용 / sitemap.xml에 있는 주소다. 6건(2026-06-29~10-12). 행사 후기·보도 위주다. 사이드에 최신 공지 2건이 붙는다
  - RSS: 사이트에서 찾지 못했다
  - 삼성전자 뉴스룸 태그 RSS `https://news.samsung.com/kr/tag/%ec%82%bc%ec%84%b1%ec%b2%ad%eb%85%84sw%e2%88%99ai%ec%95%84%ec%b9%b4%eb%8d%b0%eb%af%b8/feed` — 검색 결과에 보였다. 막힘: `https://news.samsung.com/robots.txt`가 TLS 연결 뒤 응답 없이 시간 초과(2회). 피드는 요청하지 않았다
  - SNS: `https://www.instagram.com/hellossafy`, `https://www.facebook.com/hellossafy`, `https://www.youtube.com/@hellossafy/streams`, 카카오톡 채널 `http://pf.kakao.com/_Vhxoxnxb`(공지 상세 링크). 설명회 신청은 Google Forms(`https://forms.gle/miNZcPaqP9ZNgyxP6` 등)
- 약관: `https://www.ssafy.com/ksp/jsp/swp/etc/swpPolicy.jsp`. 크롤링 명시 조항은 없다. 금지 행위 ⑺ "본 서비스를 통해 얻은 정보를 회사의 사전 승낙 없이 서비스 이용 외의 목적으로 복제하거나, 이를 출판 및 방송 등에 사용하거나, 제 3자에게 제공하는 행위". 4항 "회원은 서비스를 이용하여 취득한 정보를 … 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다."
- 최근 12개월 행사(2025-11~2026-10): 모집 공고 3건, 설명회 1건, 교육생 전용 대회 2건
  - 15기 모집 — 2025-10-27~11-10 — 모집 공고 — 국내 — 주최 — 공개(지원자 모집) — 모음 사이트: 미확인 — 근거: 검색 근거 `https://news.samsung.com/kr/ai-%ec%9d%b8%ec%9e%ac%eb%a1%9c-%eb%8f%84%ec%95%bd%ed%95%a0-%ea%b8%b0%ed%9a%8c-%ec%b2%ad%eb%85%84-sw%e2%88%99ai-%ec%9d%b8%ec%9e%ac-%ed%82%a4%ec%9a%b0%eb%8a%94-ssafy-15%ea%b8%b0`
  - 16기 모집 — 2026-04-27~05-11 — 모집 공고 — 국내 — 주최 — 공개 — 모음 사이트: 미확인 — 근거: 공지 목록("16기 모집공고" 2026-04-13, "16기 지원서 접수 시작" 2026-04-27). 마감일은 검색 근거 `https://news.samsung.com/kr/ai%EB%A1%9C-%EC%97%AC%EB%8A%94-%EB%82%98%EB%A7%8C%EC%9D%98-%EB%AF%B8%EB%9E%98-%EC%B2%AD%EB%85%84-sw%E2%88%99ai-%EC%9D%B8%EC%9E%AC-%ED%82%A4%EC%9A%B0%EB%8A%94-ssafy-16%EA%B8%B0`
  - 우리은행 x SSAFY AI 아이디어 경진대회 — 2026-06-05 — 경진대회 — 국내 — 공동 주최(우리은행) — 교육생 전용 — 모음 사이트: 미확인 — 근거: SSAFY 소식(2026-06-29 글, "지난 5일")
  - SSAFY X Kakao tech bootcamp AI Hackathon — 2026-06-13~14 — 해커톤 — 국내(카카오 AI캠퍼스, 용인) — 공동 주최(카카오테크 부트캠프) — 양측 교육생 전용(12팀 90여 명) — 모음 사이트: 미확인 — 근거: 검색 근거 `https://www.kakaocorp.com/page/detail/12054?lang=ENG`
  - 17기 모집설명회 — 온라인 2026-10-15 16:00, 오프라인 2026-10-22~11-03(서울·부산·대전·대구·광주·인천·수원), 신청 ~11-03 — 설명회 — 국내·온라인 — 주최 — 공개(사전 신청, 많으면 추첨) — 모음 사이트: 미확인 — 근거: 공지 상세(위 `p_receipt_seq=189`)
  - 17기 모집 — 2026-10-26~11-09 — 모집 공고 — 국내 — 주최 — 공개 — 모음 사이트: 7곳에서 찾지 못함. 링커리어에 12기 공고(`https://linkareer.com/activity/178546`, 검색 근거)만 있음(재조사) — 근거: SSAFY 소식 "청년 SW·AI인재 키우는 SSAFY 17기 모집"(2026-10-12), 공지 "17기 모집공고"(2026-10-12)
- 예정(2026-11 이후): 17기 오프라인 설명회 ~11-03, 17기 접수 마감 11-09. 17기 교육 시작일은 미확인
- 메모:
  - 모집은 연 2회(4~5월, 10~11월)다. 공지는 접수 2주 전에 올라왔다(17기: 공지 10-12, 접수 10-26)
  - 세지 않은 것: 13기 수료식(2025-12-18, 검색 근거), 15기 입학식(2026-01-22, 검색 근거), 14기 수료식(2026-06-30, 직전 프로젝트 발표회 포함, SSAFY 소식), 16기 입학식(2026-07-23, SSAFY 소식), 수기 공모전(2026-09-08~09-28, 개발 행사 아님), 채용박람회·채용설명회(SSAFY 소식 2026-07-20)
  - 15기·16기 모집설명회 날짜는 찾지 못했다(검색 2회). 공지 목록 2페이지는 받지 않았다
  - 검색 결과에 `https://linkareer.com/activity/318073`, `https://opcl.kr/event-details/3HPGmp0BGedfapFa51DK/`, `https://eopla.net/magazines/36019`가 보였다. 어느 기수 공고인지 미확인. 요청하지 않았다

## 우아한테크코스

- 조사 범위: `techcourse.woowahan.com`, 지원 사이트 `apply.techcourse.co.kr`(robots만), 우아한형제들 기술블로그 education 카테고리, 우테코 뉴스레터(maily.so)
- 공지 위치:
  - 공식 사이트 `https://techcourse.woowahan.com/` — 읽기: CSR(`<div id="app"></div>`뿐) / robots: `/api/` 금지 / 막힘: 본문은 JS로만 그려지고 데이터 API 경로는 robots 금지다. sitemap.xml에는 루트 1개(lastmod 2018)뿐이다
  - 지원 사이트 `https://apply.techcourse.co.kr/` — robots: robots 없음(`/robots.txt`가 SPA HTML을 200으로 준다) / 읽기: CSR로 보인다(그 응답이 빈 앱 껍데기). 본문은 받지 않았다
  - 기술 블로그 RSS `https://techblog.woowahan.com/category/education/feed/` — 읽기: 공식 API·RSS / robots: 허용(`/wp-admin/`만 금지) / 10건(2023-04~2026-09). 8기 모집 글(2025-09-17)이 여기 올라왔다. 기간 내 우테코 글은 "우테코 7기 크루 서비스 론칭!"(2025-12-05) 1건이다. 9기 모집 글은 없다
  - 뉴스레터 `https://maily.so/wooteco.newsletter` — 읽기: SSR / robots: 허용(`/*/subscriptions/*`, `/*/users`, `/backend`만 금지) / 10건(2025-10-24~2026-10-14), 제목·날짜·요약이 HTML에 있다. HTML에 RSS 링크는 없다. 대략 격주 발행이다
- 약관: 미확인(공식 사이트가 CSR이라 약관 링크를 읽지 못했다)
- 최근 12개월 행사(2025-11~2026-10): 모집 공고 0건 확인, 행사 1건(회원 전용)
  - 제1회 테코톤 — 날짜 미확인(후기 2026-06-10) — 해커톤 — 국내 — 주최 — 회원 전용(크루 대상) — 모음 사이트: 미확인 — 근거: `https://maily.so/wooteco.newsletter/posts/1gz2egkwz3q`
- 예정(2026-11 이후): 찾지 못했다
- 메모:
  - 9기(2027) 모집 공고를 찾지 못했다(검색 3회, 블로그 RSS, 뉴스레터). 8기는 블로그 글 2025-09-17, 온라인 입학설명회 2025-09-24, 서류 2025-09-29~10-10이었다(검색 근거 `https://cse.snu.ac.kr/ko/community/notice/24259`). 같은 주기라면 이미 공지됐을 시점이다. 9기를 뽑는지는 미확인
  - 8기 선발 과정은 기간에 걸친다. 프리코스 2025-10-14~11-17, 최종 합격 2026-01-23, 교육 2026-02부터 10개월(검색 근거). 모집 공고가 기간 전이라 세지 않았다
  - 7기 최종 데모데이·런칭데이는 2025-10 하순이다(뉴스레터 19호 2025-10-31 "지난 주"). 기간 전
  - 블로그 "우테코 7기 크루 서비스 론칭!"(2025-12-05)은 서비스 소개 글이다. 행사가 아니다
  - 뉴스레터에 레벨 데모데이·팀 빌딩 데이 이야기가 있다. 모두 크루 대상이다

## 네이버 부스트캠프

- 조사 범위: `boostcamp.connect.or.kr` 메인·웹모바일·AI Tech 페이지, 커넥트재단·네이버 블로그 robots
- 공지 위치:
  - 공식 사이트 `https://boostcamp.connect.or.kr/` — 읽기: SSR(정적 HTML) / robots: 허용(`/css/`, `/js/`, `/fonts/`, `/images/`, `/sass/`만 금지) / 팝업 공지 "2026년에는 부스트캠프 웹·모바일, AI Tech 과정을 운영하지 않습니다"가 HTML에 있다. 게시 날짜는 없다
  - 과정 페이지 `https://boostcamp.connect.or.kr/main_wm.html`, `https://boostcamp.connect.or.kr/program_ai.html` — 읽기: SSR / 10기 일정·지난 모집 일정이 HTML에 남아 있다
  - 블로그 `https://blog.naver.com/boostcamp_official` — robots: `blog.naver.com`은 `/PostList.naver` 등 금지, RSS 호스트 `rss.blog.naver.com`은 전체 금지(`Disallow: /`). 블로그는 요청하지 않았다
  - 재단 사이트 `https://www.connect.or.kr/` — robots: robots 없음(404 JSON). 본문은 받지 않았다
  - SNS: `https://www.instagram.com/boostcamp.aitech/`, `https://www.instagram.com/boostcamp.webmobile/`
- 약관: 미확인
- 최근 12개월 행사(2025-11~2026-10): 0건 확인(모집 0건, 행사 0건)
- 예정(2026-11 이후): 없다. 2026년 과정을 운영하지 않는다(공식 사이트 팝업)
- 메모:
  - 웹·모바일 10기 교육은 2025-06-23~2026-02-06이다(기간에 걸침). 모집은 2025-05-26~06-09라 기간 전이다. 10기 공개 발표·데모데이는 찾지 못했다(검색 1회)
  - AI Tech 8기 모집은 "8월 14일(목)" 마감이다(사이트에 남은 팝업, 요일로 2025 추정). 기간 전
  - 팝업은 "새로운 방향이 정리되면 안내"라고 한다. 재개 여부는 공식 사이트 팝업으로 알 수 있다
  - 검색 결과에 커넥트재단 '부스트클래스' 신설 기사(`https://www.smarttoday.co.kr/ko-kr/articles/40359`)가 보였다. 날짜·내용 미확인
  - 검색 결과에 `https://www.theteams.kr/activities/page/634/oa`가 보였다. 내용 미확인

## 카카오테크 캠퍼스

- 조사 범위: `www.kakaotechcampus.com` 메인·모집·뉴스, 카카오 보도자료 1건. 카카오테크 부트캠프는 다른 과정이라 보지 않았다(SSAFY 항목 공동 해커톤만 적었다)
- 공지 위치:
  - 공식 사이트 `https://www.kakaotechcampus.com/` — 읽기: SSR / robots: robots 없음(404 JSON) / 4기 모집 배너만 있다
  - 모집 페이지 `https://www.kakaotechcampus.com/kakaotech/apply/list.do` — 읽기: SSR / 선발 일정이 HTML에 있다. 연도 없이 "04월 01일 ~ 15일"로 적는다
  - 뉴스 목록 `https://www.kakaotechcampus.com/kakaotech/infomation/newsListAjax.do?p_news_call_cnt=0` — 읽기: SSR 조각(`/kakaotech/infomation/list.do#news`가 AJAX로 부르는 HTML) / 9건 제목·링크뿐, 날짜 없음
  - 뉴스 상세 `https://www.kakaotechcampus.com/kakaotech/infomation/newsDetail.do?p_news_seq=453` — 읽기: SSR / 본문에 날짜가 있다. 설명회 공지와 보도자료 재게시가 섞여 있다
  - 카카오 보도자료 `https://www.kakaocorp.com/page/detail/12129` — 읽기: SSR / robots: 허용(`Allow: /`) / 게시일·본문 있음. 2026 아이디어톤은 캠퍼스 뉴스에 없고 여기에만 있었다
  - 문의: 오픈채팅 `https://open.kakao.com/o/gme6wIli`
- 약관: 사이트에 이용약관 링크가 없다. 개인정보처리방침만 카카오 사이트로 연결된다
- 최근 12개월 행사(2025-11~2026-10): 모집 공고 1건, 행사 3건(외부 공개 1건)
  - 3기 최종 발표회 — 2025-11 중순(학교별, 보도 2025-11-27) — 성과 발표회 — 국내(5개 대학) — 주최 — 교육생 대상, 외부 공개 미확인 — 모음 사이트: 7곳에서 찾지 못함(재조사) — 근거: `https://www.kakaotechcampus.com/kakaotech/infomation/newsDetail.do?p_news_seq=452`, 일정 예고 `https://www.kakaotechcampus.com/kakaotech/infomation/newsDetail.do?p_news_seq=421`
  - 4기 모집 — 2026-04-01~04-15 — 모집 공고 — 온라인 과정 — 주최 — 참여 대학(강원·경북·부산·전남·충남대) 재학생 — 모음 사이트: 미확인 — 근거: `https://www.kakaotechcampus.com/kakaotech/infomation/newsDetail.do?p_news_seq=453`, `https://www.kakaotechcampus.com/kakaotech/apply/list.do`
  - 4기 온라인 사전설명회 — 2026-04-03 19:00~20:00 — 설명회 — 온라인(YouTube Live) — 주최 — 공개(참석 신청서) — 모음 사이트: 미확인 — 근거: `https://www.kakaotechcampus.com/kakaotech/infomation/newsDetail.do?p_news_seq=453`
  - 카카오테크 캠퍼스 아이디어톤(2026) — 2026-08-22~23 — 아이디어톤(해커톤 형식) — 국내(장소 미확인) — 주최 — 교육생 전용(145명) — 모음 사이트: 미확인 — 근거: `https://www.kakaocorp.com/page/detail/12129`
- 예정(2026-11 이후): 4기 최종 발표회 — 2026-11 중순 — 각 학교 — 교육생 대상(근거: `https://www.kakaocorp.com/page/detail/12129`)
- 메모:
  - 연 1기수다. 모집 4월, 교육 5~11월, 아이디어톤 8월, 최종 발표 11월 중순이다
  - 5기 모집은 미확인이다(시기상 2027-04 예상, 확인 안 됨)
  - 2025 아이디어톤(2025-08-09~10)은 기간 전이다
  - 보도자료 원문은 kakaocorp.com이 먼저다. 캠퍼스 뉴스는 일부만 다시 싣는다

## 크래프톤 정글

- 조사 범위: `jungle.krafton.com` 메인·공지사항·프로젝트 전시회·모집 일정·이용약관
- 공지 위치:
  - 모집 일정 `https://jungle.krafton.com/schedule/all` — 읽기: SSR(Next.js) / robots: 허용(`User-agent: *`는 `Disallow: /` 뒤에 `/$`, `/news/`, `/schedule/`, `/courses/`, `/etc/terms` 등만 허용) / 과정별 모집·전형·교육 기간이 HTML에 있다. 다음 기수(2026-12-28 모집)까지 미리 나온다
  - 공지 목록 `https://jungle.krafton.com/news/announcement` — 읽기: SSR / robots: 허용 / 첫 페이지 12건(총 23건) 제목·날짜·과정 태그가 HTML에 있다. 페이지 이동은 클라이언트 처리라 2페이지는 받지 않았다
  - 공지 상세 `https://jungle.krafton.com/news/112` — 읽기: 본문 CSR("Loading..."). `og:description` 앞부분과 `article:published_time`만 HTML에 있다
  - 프로젝트 전시회 `https://jungle.krafton.com/news/exhibitions` — 읽기: SSR / 총 40건. 수료 프로젝트 소개와 Steam 출시 소식이다. 오프라인 행사 공지는 없다
  - 뉴스레터 `https://maily.so/kjdc` — 검색 결과에 보였다("크래프톤 정글 뉴스레터"). 요청하지 않았다
  - 주의: `/news`(끝 슬래시 없음), `/mypage/`, `/signin`은 robots 금지다
- 약관: `https://jungle.krafton.com/etc/terms`. 크롤링 명시 조항은 없다. 제16조 "회사 또는 제공업체의 사전승낙 없이 복제, 전송, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다."
- 최근 12개월 행사(2025-11~2026-10): 모집 공고 2회(과정 6개), 설명회 2건
  - SW-AI Lab 12기·Game Lab 5기·Game Tech Lab 3기 모집 — 2025-12-29~2026-01-18 — 모집 공고 — 국내 — 주최 — 공개 — 모음 사이트: 링커리어 `https://linkareer.com/activity/291492`(검색 근거). 이벤터스에는 8기 공고(`https://event-us.kr/allforyoung/event/96855`)만 있음(재조사) — 근거: `https://jungle.krafton.com/schedule/all`
  - 2026 하반기 통합 설명회 — 2026-05-16(공지 제목 "260516" 기준) — 설명회 — 형식 미확인 — 주최 — 지원자 대상, 외부 공개 미확인 — 모음 사이트: 이벤터스 `https://event-us.kr/maycan/event/124288`(재조사, 대행사 채널), 자소설닷컴 `https://jasoseol.com/companies/2780/careers`("2026 사전 설명회", 검색 결과에 보임) — 근거: `https://jungle.krafton.com/news/announcement`(2026-05-29 다시보기 공지)
  - SW-AI Lab 13기·Game Lab 6기·Game Tech Lab 4기 모집 — 2026-06-08~07-05 — 모집 공고 — 국내 — 주최 — 공개 — 모음 사이트: 미확인 — 근거: `https://jungle.krafton.com/schedule/all`
  - [JDC Live] 크래프톤 정글 지원자를 위한 Q&A Live — 날짜 미확인(공지 2026-06-10) — 설명회(Q&A) — 온라인(유튜브 라이브) — 주최(수료생 모임 JDC와 함께) — 공개(지원자 대상) — 모음 사이트: 미확인 — 근거: `https://jungle.krafton.com/news/112`
- 예정(2026-11 이후): SW-AI Lab 14기·Game Lab 7기·Game Tech Lab 5기 모집 2026-12-28~2027-01-17(근거: `https://jungle.krafton.com/schedule/all`)
- 메모:
  - 연 2회 모집이다(6~7월, 12~1월). 모집 일정 페이지가 가장 좋은 공지 위치다
  - Game Lab은 게임 제작 과정이다. 개발 분야로 볼지 ※ 판단 필요
  - 세지 않은 것: 파트너 기업 채용설명회·커리어 특강(교육생 전용), Game Lab 4기 8개 게임 Steam 출시(2026-01-29 글), Game Lab 5기 게임 Steam 공개(2026-07-31, 07-27 글). 출시 소식이지 행사가 아니다
  - 오프라인 데모데이·수료 발표회 공지는 찾지 못했다(검색 1회)
  - 2026 상반기(12기) 설명회는 찾지 못했다(검색 1회, 공지 2페이지 미확인)
  - 검색 결과에 `https://eopla.net/magazines/37869`(12기 모집 소개), `https://eopla.net/magazines/41458`, `https://eopla.net/magazines/43497`가 보였다. 요청하지 않았다

## 42서울

- 조사 범위: `42seoul.kr` robots, 42 Network 사이트 robots·아시아 캠퍼스 목록
- 공지 위치:
  - 공식 사이트 `https://42seoul.kr/` — 막힘: 도메인 전체가 다른 곳으로 간다. `https://42seoul.kr/robots.txt`와 `https://www.42seoul.kr/robots.txt` 모두 301 → `https://42network.org` → `https://www.42network.org/`(42 Network 본부 홈, 영어)로 끝난다
  - 42 Network `https://www.42network.org/42-schools/?r=asia` — 읽기: CSR(캠퍼스 목록이 HTML에 없다) / robots: 허용(`/42-schools/?r=*` 명시 허용. 그 밖의 `/*?`, `*/feed`는 금지) / HTML에 Seoul·Korea 문자열이 없다
  - 42서울 자체 공지 위치를 찾지 못했다
- 약관: 미확인
- 최근 12개월 행사(2025-11~2026-10): 찾지 못했다(검색 3회)
- 예정(2026-11 이후): 찾지 못했다
- 메모:
  - 42seoul.kr이 42 Network 홈으로 넘어가는 이유는 미확인이다. 운영 종료·이전 여부를 확인하지 못했다
  - 검색에는 42경산(경산이노베이션아카데미) 4기 라피신 모집 기사만 나왔다(2026-06-03, 검색 근거 `https://www.kbmaeil.com/article/20260603500003`). 다른 기관이라 세지 않았다

## 소프트웨어 마에스트로

- 조사 범위: `www.swmaestro.ai` 서울센터 메인·제17기 모집 공고·알림마당·소식 게시판. 부산센터(`/busan/`)는 보지 않았다
- 공지 위치:
  - 공식 사이트 `https://www.swmaestro.org/` — 302로 `https://www.swmaestro.ai/sw/main/main.do`에 간다. 이름이 "AI·SW마에스트로"로 바뀌었다
  - robots `https://www.swmaestro.ai/robots.txt` — `Yeti`·`Googlebot`만 `Disallow: /`다. 그 밖의 봇 규칙은 없다(허용). 표기가 `User-agent :`(콜론 앞 공백)다
  - 모집 공고 `https://www.swmaestro.ai/sw/main/notifyMentee.do?menuNo=200091` — 읽기: SSR / 접수 기간·전형 일정·설명회가 HTML에 있다. 메뉴 이름이 기수마다 바뀐다(현재 "제17기 연수생 모집 공고")
  - 알림마당 `https://www.swmaestro.ai/sw/bbs/B0000003/list.do?menuNo=200020` — 읽기: SSR / 제목·날짜 있음. 외부 행사·채용 큐레이션 글이 대부분이다(2025-09~2026-09)
  - 소식 `https://www.swmaestro.ai/sw/bbs/B0000002/list.do?menuNo=200019` — 읽기: SSR / 마지막 글 2025-12-31
  - 메인 `https://www.swmaestro.ai/sw/main/main.do` — 읽기: SSR / 하단 "지원절차" 상자는 16기 일정('25. 1. 13.~2. 12.)이 그대로다. 메인만 보면 틀린다
  - 블로그 `https://blog.naver.com/sw_maestro` — RSS 호스트 robots 전체 금지(부스트캠프 항목 참고). 요청하지 않았다
  - SNS: `https://www.instagram.com/aiswmaestro_official/`, `https://www.facebook.com/aiswmaestro/`, `https://www.linkedin.com/company/swmaestro-official/`, `https://www.youtube.com/user/2013SWMaestro`
- 약관: 이용약관(`/sw/main/contents.do?menuNo=200029`)은 받지 않았다. 미확인. 이메일무단수집거부 페이지(`/sw/main/contents.do?menuNo=200030`)는 이메일 주소 자동 수집만 금지한다
- 최근 12개월 행사(2025-11~2026-10): 모집 공고 2건, 설명회 1건
  - 제17기 서울센터 연수생 모집 — 2026-01-12 10:00~02-11 17:00 — 모집 공고 — 국내 — 주최(과기정통부·정보통신기획평가원, 운영 한국정보산업연합회) — 공개 — 모음 사이트: 씽유 `https://thinkyou.co.kr/contest/60360/`(검색 결과에 보임, 서울·부산 구분 미확인) — 근거: `https://www.swmaestro.ai/sw/main/notifyMentee.do?menuNo=200091`
  - 제17기 부산센터 연수생 모집 — 2026-02-13 10:00~03-12 17:00 — 모집 공고 — 국내 — 주최 — 공개 — 모음 사이트: 이벤터스 `https://event-us.kr/asmbusan/event/121082`(재조사). 링커리어에는 서울센터 공고(`https://linkareer.com/activity/294431`, 검색 근거)만 있음 — 근거: 같은 페이지
  - 부산센터 과정설명회 — 2026-02-05 14:00 — 설명회 — 국내(벡스코 제1전시장 214호) — 주최 — 외부 공개 미확인 — 모음 사이트: 이벤터스 `https://event-us.kr/asmbusan/event/120161`(재조사) — 근거: 같은 페이지
- 예정(2026-11 이후): 찾지 못했다. 18기 공고는 아직 없다(17기 서울 접수는 2026-01 시작)
- 메모:
  - 17기 서울 전형: 1차 코딩테스트 2026-02-28, 2차 03-07, 면접 03-19~22, 발표 03-25. 선발 서울 300명·부산 150명
  - 세지 않은 것: 17기 서울센터 발대식(2026-06-30, 검색 근거 `https://eiec.kdi.re.kr/policy/materialView.do?num=283577`), 부산센터 9월 월간공유회 "Show & Share"(2026-09-10, 연수생 대상), 16기 소마 메이커스 AI 해커톤(2025-10-30 글, 기간 전·날짜 미확인), 2026년 멘토 모집(교육생 모집 아님)
  - 16기 수료·성과 발표 행사(2025-11~12)는 찾지 못했다(검색 1회)
  - 서울센터 설명회 일정은 17기 공고에 없다

## Apple Developer Academy(포항)

- 조사 범위: `developeracademy.postech.ac.kr` 사이트맵·지원하기·이벤트·소식 1건
- 공지 위치:
  - 이벤트 `https://developeracademy.postech.ac.kr/event` — 읽기: SSR(Wix) / robots: 허용(`*?lightbox=`만 금지, PetalBot 전체 금지) / 다가오는 행사 5건의 이름·일시·온오프라인이 HTML 텍스트에 있다. 지난 행사 하이라이트(날짜·장소)도 있다. 페이지가 1.7MB로 크다
  - 지원하기 `https://developeracademy.postech.ac.kr/apply` — 읽기: SSR / 모집 기간이 시각까지 있다
  - 이벤트 사이트맵 `https://developeracademy.postech.ac.kr/dynamic-event_p_c45c6953_69b8_4283_8eb8_0229dd3e58cc_0_5000-sitemap.xml`, `https://developeracademy.postech.ac.kr/event-pages-sitemap.xml` — 읽기: XML / 행사 슬러그와 lastmod가 있다. 새 행사 감지에 쓸 수 있다
  - 소식 사이트맵 `https://developeracademy.postech.ac.kr/dynamic-news_p_38f064d4_173e_4b19_a0db_d368cd892b45_0_5000-sitemap.xml` — 읽기: XML / 소식 글 슬러그와 lastmod
  - 소식 글 `https://developeracademy.postech.ac.kr/news/showcase25` — 읽기: SSR / 게시일·본문 있음
  - RSS: 찾지 못했다(사이트맵 목록에 없다)
  - Cloudflare 앞단이지만 확인 화면은 없었다
- 약관: 미확인
- 최근 12개월 행사(2025-11~2026-10): 모집 공고 3건, 행사 8건
  - SHOWCASE25 — 2025-11-27(소식 2025-12-02의 "지난 목요일"로 계산) — 성과 발표회(4기 앱 30개 부스) — 국내(포항 아카데미) — 주최 — 공개(가족·동문·기업·"일반 참가자" 참석) — 모음 사이트: 이벤터스 `https://event-us.kr/appledevacademy/event/116514`(재조사 중 발견) — 근거: `https://developeracademy.postech.ac.kr/news/showcase25`
  - 2026년도 아카데미 5기 일반 모집 — 2025-05-01~2025-12-08 13:00 — 모집 공고 — 국내 — 주최 — 공개 — 모음 사이트: 씽유 `https://thinkyou.co.kr/contest/59098/`(검색 결과에 보임) — 근거: 검색 근거(씽유)
  - 아카데미 코티지 인 서울 — 2026-03-29 — 종류 미확인 — 국내(서울 연남) — 주최 — 외부 공개 미확인 — 모음 사이트: 미확인 — 근거: `https://developeracademy.postech.ac.kr/event`
  - 6기 패스트 트랙 — 서류 마감 05-14 13:00, 최종 발표 06-05(연도 미확인, 요일로 2026 추정) — 모집 공고 — 국내 — 주최 — 공개(실무 경력자 대상) — 모음 사이트: 링커리어 `https://linkareer.com/activity/341872` 또는 `https://linkareer.com/activity/316590`(검색 결과에 보임, 어느 쪽인지 미확인) — 근거: 검색 근거(링커리어)
  - 2027년도 아카데미 6기 일반 전형 모집 — 2026-05-14 09:00~2026-12-09 13:00 — 모집 공고 — 국내 — 주최 — 공개 — 모음 사이트: 미확인 — 근거: `https://developeracademy.postech.ac.kr/apply`
  - WWDC26 Watch Party in 서울 — 2026-06-08 — 시청 행사 — 국내(서울) — 주최 — 외부 공개 미확인 — 모음 사이트: 미확인 — 근거: `https://developeracademy.postech.ac.kr/event`
  - WWDC26 Watch Party in 포항 — 2026-06-08 — 시청 행사 — 국내(아카데미) — 주최 — 외부 공개 미확인 — 모음 사이트: 미확인 — 근거: 같은 페이지
  - AI 플레이그라운드 인 서울 — 2026-07-20~23 — 종류 미확인 — 국내(동국대학교) — 주최 — 외부 공개 미확인 — 모음 사이트: 미확인 — 근거: 같은 페이지
  - 오픈데이 2026: 1일 러너 체험하기 — 2026-08-22 — 오픈데이(체험) — 국내(아카데미) — 주최 — 지원 희망자 대상으로 보임, 미확인 — 모음 사이트: 미확인 — 근거: 같은 페이지
  - 캠퍼스 워크숍 @ 경북대학교 — 2026-09-02 — 워크숍 — 국내(경북대) — 주최 — 외부 공개 미확인 — 모음 사이트: 미확인 — 근거: 같은 페이지
  - 워크숍: 포트폴리오 챌린지 2026 — 2026-10-26 19:00~10-30 19:00 — 워크숍 — 온라인 — 주최 — 외부 공개 미확인 — 모음 사이트: 7곳에서 찾지 못함. 이벤터스에 2026-05 시즌 1·2(`https://event-us.kr/appledevacademy/event/125061`, `https://event-us.kr/appledevacademy/event/125063`)만 있음(재조사) — 근거: 같은 페이지
- 예정(2026-11 이후): 근거는 모두 `https://developeracademy.postech.ac.kr/event`
  - 11월 세미나: 아카데미 지원 같이하기 — 2026-11-03 19:00 — 온라인
  - 워크숍: AI 시대, 나만의 취향으로 커리어 시작하기 — 2026-11-04 18:00~11-10 19:00 — 오프라인
  - SHOWCASE26: 꿈의 파도를 타고, 더 눈부시게 — 2026-11-20 13:30~17:30 — 오프라인
  - 12월 세미나: 아카데미 지원 같이하기 — 2026-12-01 19:00 — 온라인
  - 6기 일반 전형 마감 — 2026-12-09 13:00(근거: `https://developeracademy.postech.ac.kr/apply`)
- 메모:
  - 이벤트 페이지는 세미나를 "가장 가까운 일정에 무료로 참여하세요"라고 안내한다. 지원자용 세미나는 외부 공개로 보인다
  - 사이트맵 슬러그로만 본 2026 행사(상세는 받지 않음, 날짜는 슬러그 기준): 세미나 4/21·4/28·5/6·5/27·6/22·6/23·7/28·9/15·10/13, 로드쇼 서울 4/28·5/6(2회)·부산 4/29, 포트폴리오 챌린지 `pfc26-s1`·`pfc26-s2`, `atg26`·`atg26-alumni`, `ideaplayground26`, `playground26`, `uni-workshop26`, `workshop-oct23`. 소식 사이트맵에 `insightsession-oct16`도 있다. 지원자 세미나는 월 1~2회 열린다
  - 이벤트 사이트맵에 `insight-nov19`, `naeilsallong-2025-2`도 있다. 연도·날짜 미확인
  - 세지 않은 것: 동문 신년회 2026(2026-02-07, 동문 행사), Today at Apple 생산성 백배 단축어 꿀팁(2026-01-24 Apple Store 명동, 개발 행사가 아니라고 봤다)
  - 파운데이션 프로그램(`https://developeracademy.postech.ac.kr/foundation-program`, `https://developeracademy.postech.ac.kr/fdn26-4`)과 패스트 트랙(`https://developeracademy.postech.ac.kr/fasttrack2026-1`, `https://developeracademy.postech.ac.kr/cohort2027apply-ft1`) 페이지가 사이트맵에 있다. 받지 않아 모집 날짜는 미확인이다
  - 검색 결과에 `https://www.superookie.com/activities/6895436a034fab484a7bd376`, `https://www.theteams.kr/recruit_big/detail/1071690`, `https://career.rememberapp.co.kr/job/posting/345013`가 보였다(5기·6기 모집 관련으로 보임). 요청하지 않았다

## 묶음 요약

- 기간 내 모집 공고: SSAFY 3건(15·16·17기), 크래프톤 정글 2회(과정 6개), 소프트웨어 마에스트로 2건(17기 서울·부산), 카카오테크 캠퍼스 1건(4기), Apple 3건(5기 일반·6기 패스트 트랙·6기 일반). 우테코 0건(9기 미확인), 부스트캠프 0건(2026 운영 안 함), 42서울 0건(찾지 못함).
- 외부 공개가 확인된 성과 행사는 Apple SHOWCASE25(2025-11-27) 1건뿐이다. 해커톤·발표회 대부분은 교육생 전용이다(SSAFY×우리은행, SSAFY×카카오테크 부트캠프, 카카오테크 캠퍼스 아이디어톤·최종 발표회, 우테코 테코톤).
- 공개 설명회는 SSAFY(17기), 카카오테크 캠퍼스(4기), 크래프톤 정글(2026 하반기, JDC Live), 소프트웨어 마에스트로(부산), Apple(월 1~2회 세미나)이 연다.
- 봇이 읽을 수 있는 곳(SSR, robots 허용): SSAFY 공지 게시판, 정글 모집 일정·공지 목록, 소마 모집 공고 페이지, 카카오테크 캠퍼스 뉴스(AJAX 조각, 날짜는 상세에만), Apple 이벤트 페이지·사이트맵, 부스트캠프 메인 팝업, 우테코 뉴스레터(maily.so). RSS는 우테코(기술블로그 education 카테고리)만 있다.
- 막힌 곳: 우테코 공식 사이트(CSR, `/api/` robots 금지), 42서울(도메인이 42 Network 홈으로 301), 삼성전자 뉴스룸(응답 없음), 네이버 블로그 RSS(부스트캠프·소마, robots 전체 금지), 정글 공지 상세 본문(CSR).
- 모음 사이트는 검색 결과에서 우연히만 봤다: 씽유(소마 17기, Apple 5기), 링커리어(SSAFY, Apple), 자소설닷컴(정글 설명회), 슈퍼루키·더팀스·리멤버(Apple), opcl.kr(SSAFY), eopla.net(SSAFY·정글). 이벤터스·ticketa·OKKY·Luma·Meetup·위비티는 보지 못했다(따로 찾지 않았다).
- 재조사(2026-10-25)에서 표본 7건을 모음 사이트 7곳에서 찾았다. 4건이 나왔다(이벤터스 3, 링커리어 1). 2건은 다른 기수 공고만 있었다. 표본 밖에서 나온 것: 이벤터스의 SHOWCASE25, SSAFYnity 커리어 파티(2025-12-06, `https://event-us.kr/ssafy/event/117342`), 소마 17기 발대식(`https://event-us.kr/aiswmaestro/event/126393`), 부산 PRE-SOMA(`https://event-us.kr/presoma/event/135118`), ticketa의 Apple 디벨로퍼 아카데미 로드쇼 4건.
