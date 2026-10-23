# 국내 개발자 행사 확인 사이트 목록

확인 날짜: 2026-10-23 (한국 시간).

해커톤·공모전·경진대회·세미나·컨퍼런스·밋업을 확인할 수 있는 사이트를 모았다. 해외 사이트는 국내 행사가 올라오는 곳만 넣었다.

조사 방법:

- 봇 UA로 첫 화면과 robots.txt를 1회씩 받았다. 사이트 사이 간격은 1초다.
- robots 판정은 표에 적은 URL 기준이다(Python `urllib.robotparser`).
- 약관과 상세 조사는 [SOURCE_CANDIDATES.md](SOURCE_CANDIDATES.md)에 있다(2026-10-23).
- "네임드" 여부는 판단하지 않는다.
- 이전에 조사한 사이트의 읽기 방식은 [SOURCE_CANDIDATES.md](SOURCE_CANDIDATES.md)를 따른다. 이 문서의 "읽기" 칸은 그 요약이다.

"읽기" 칸:

- 운영: 지금 봇이 수집한다 ([SOURCES.md](SOURCES.md))
- SSR, 내장 데이터, 숨은 API, 공식 API·RSS, CSR: [SOURCE_CANDIDATES.md](SOURCE_CANDIDATES.md)의 구분
- 미조사: 첫 화면만 받았다. 괄호 안은 첫 화면에서 본 것이다
- 불가: robots 금지, 로그인, 차단, 연결 실패, 점검

메모 칸의 "N건 중 개발 M"은 2026-10-23 1회 스냅샷의 1페이지 기준이다. "약관:"은 자동 수집·재배포 조항의 요약이다.

## 1. 공모전·대외활동 모음

| 사이트 | URL | 다루는 것 | 읽기 | 메모 |
| --- | --- | --- | --- | --- |
| 위비티 | `https://www.wevity.com` | 공모전 전 분야. IT 분류가 있다 | 운영 | |
| 콘테스트코리아 | `https://www.contestkorea.com` | 공모전 전 분야 | SSR | IT 단독 분류가 없다. 12건 중 개발 4. 약관: 자동 수집·재배포 조항 없음 |
| 링커리어 | `https://linkareer.com/list/contest` | 공모전·대외활동 | SSR | 추천·광고 8개가 섞인다. 일반 20건 중 개발 4. 약관: 회원의 자동화 접근 금지 |
| 씽굿 | `https://www.thinkcontest.com` | 공모전. 게임/소프트웨어 분야가 있다 | 숨은 API(POST) | 분야 필터가 동작한다. 10건 중 개발 6. 약관: 이용자의 제3자 이용 금지 |
| 올콘 | `https://www.all-con.co.kr` | 공모전. 개발 분류가 있다 | 숨은 API(POST) | 개발 소분류 15건 중 개발 12. 약관: 회원의 복제·유통에 사전 승낙 필요 |
| 대티즌 | `https://www.detizen.com` | 공모전 | 숨은 API(GET) | 분류 파라미터가 없다. 27건 중 개발 0. 약관: 비회원 포함 무단 크롤링 금지 |
| 캠퍼스픽 | `https://www.campuspick.com/contest` | 대학생 공모전 | SSR | 24개 고정. 분류 필터가 반영되지 않는다. 24건 중 개발 3. 약관: 비회원 포함 봇 접근 금지 |
| 요즘것들 | `https://www.allforyoung.com/posts/contest` | 공모전·대외활동. IT/AI/데이터 태그 | 내장 데이터 | AI 봇 30종 금지. 일반 16건 중 개발 7. 약관: 비회원 포함 DB 복제·전송 금지 |
| 씽유 | `https://thinkyou.co.kr/contest/` | 공모전 | SSR | `serfield=5`(IT·SW) GET 필터. 33건 중 개발 13. GPTBot만 금지. 약관: 이용자의 제3자 이용 금지 |
| 슥삭 | `https://www.ssgsag.kr` | 대외활동·공모전·인턴·교육 | 숨은 API(GET) | IT/SW 13건 중 개발 2. 교육생 모집이 "공모전"으로 분류된다. 약관: 회원 봇 금지 |

## 2. AI·데이터 경진대회

| 사이트 | URL | 다루는 것 | 읽기 | 메모 |
| --- | --- | --- | --- | --- |
| DACON | `https://dacon.io/competitions` | AI·데이터 대회, 해커톤 | 운영 | 약관 개정(`notice/137`, 2026-08-21 시행) |
| AI Hub | `https://www.aihub.or.kr` 공지 | 경진대회 공지 일부 | SSR | 대회 전용 메뉴가 없다. 2페이지 20건 중 개발 2 |
| 공공데이터포털 | `https://www.data.go.kr` 공지 | 활용 공모전 공지 | SSR | 운영 공지가 대부분이다. 2페이지 20건 중 개발 1 |
| 빅콘테스트 | `https://www.bigcontest.or.kr` | 연 1회 데이터·AI 경진대회 | SSR(단일 행사) | 제14회(2026). 제출 마감 10.26. 약관 없음 |
| AI Stages | `https://stages.ai/competitions` | AI 대회 | 불가 | 목록 주소가 로그인 화면으로 넘어간다 |
| Kaggle | `https://www.kaggle.com/competitions` | 해외 AI 대회 | CSR | 약관이 크롤링 금지(검색 근거) |

## 3. 해커톤

| 사이트 | URL | 다루는 것 | 읽기 | 메모 |
| --- | --- | --- | --- | --- |
| 구름톤 | `https://9oormthon.goorm.io` | 구름 주최 해커톤 | SSR(단일 행사) | 18기 모집 종료. 연 4~5회 |
| 데이커 | `https://daker.ai` | AI 해커톤 플랫폼 | CSR | 목록 API는 robots 금지. 사이트맵에 해커톤 22개. DACON 운영, 같은 약관 |
| JunctionX Korea | `https://asia.hackjunction.com` | Junction 국내 해커톤 | CSR(단일 행사) | 2026.8.21~23 포항 종료. 일정은 JS 번들에만 있다 |
| 프로그래머스 | `https://school.programmers.co.kr/competitions` | 기업 챌린지·대회 | 숨은 API(GET) | 가장 최근 항목이 2025-01 접수다. 약관: 회원 크롤링·스크래핑 금지 |
| Devpost | `https://devpost.com/hackathons` | 해외 해커톤. 국내 개최분도 있다 | 숨은 API(GET) | 국가 필터가 없다. 약관: 모든 이용자 스크래핑 금지 |
| HackQuest | `https://www.hackquest.io/ko/hackathons` | 해외 웹3 해커톤 | 내장 데이터 | 본 9건 중 한국 개최 0. 약관: automated scraping 금지 문구 |
| NASA Space Apps Challenge | `https://www.spaceappschallenge.org` | 국제 해커톤. 도시별 현장 행사 | SSR(단일 행사) | 2026.11.14~15. 도시 목록은 GraphQL(`event` ID 필요). 서울 행사 있음(검색 근거) |

## 4. 알고리즘 대회

| 사이트 | URL | 다루는 것 | 읽기 | 메모 |
| --- | --- | --- | --- | --- |
| ICPC Korea | `https://icpckorea.org` | ICPC 서울 리저널 | 공식 RSS | `/feed`. 2026 본선 11.13~14 KINTEX |
| UCPC | `https://ucpc.me` | 대학생 동아리 연합 대회 | SSR | 회차는 `{연도}.ucpc.me`. 2026 본선 7.12 종료 |
| SCPC | `https://research.samsung.com/scpc` | 삼성 대학생 프로그래밍 경진대회 | SSR | 공식 페이지가 옮겨졌다. 이전 `codeground.org/scpc/`는 500이다. 2026 본선 8월 종료 |
| 한국정보올림피아드 | `https://koi.or.kr` | 초·중·고 대회 | 공식 RSS(Atom) | `/feed.xml`. 1·2차 연 2회 |
| NYPC | `https://nypc.github.io` | 넥슨 청소년 대회 | 불가 | `nypc.nexon.com`은 DNS가 없다. 아카이브만 열린다 |
| 백준 | `https://www.acmicpc.net` | 공식·외부 대회 목록 | 불가 | 대회 목록이 404다. 제목 "BOJ 서비스 재개 일정 연기 안내" |

## 5. 보안 CTF·해킹대회

| 사이트 | URL | 다루는 것 | 읽기 | 메모 |
| --- | --- | --- | --- | --- |
| CTFtime | `https://ctftime.org` | CTF 일정. 해외 위주 | 공식 API·RSS | API로 클론 사이트 운영 금지. 예정 42건 중 한국 0. `Crawl-delay: 10` |
| Codegate | `https://www.codegate.org` | 국제 해킹방어대회 | 불가 | 봇 UA에 403. 2026 CTF는 CTFtime에 올라왔다(검색 근거) |
| CCE | `https://cce.cstec.kr` | 사이버공격방어대회 | CSR(단일 행사) | robots.txt 자리에 HTML이 온다. 일정은 JS 번들에만 있다. 2026 본선 9.17 종료 |
| 핵테온 세종 | `https://hacktheon.org` | 국제 대학생 사이버보안 대회 | SSR(단일 행사) | 연도 경로 `/y{연도}/`. 2026.7.9~10 종료 |
| KISIA | `https://www.kisia.or.kr` | KISIA CTF 등 | 불가 | 사이트 점검 중(PHP2Shell 긴급 점검 안내 이미지) |
| POC | `https://powerofcommunity.net` | 보안 컨퍼런스 | SSR(단일 행사) | robots.txt 없음. 약관 없음. 2026.11.12~13 예정 |
| 화이트햇 콘테스트 | `https://whitehatcontest.kr` | 국방부 주최 해킹대회 | 불가 | TLS 연결 실패(서버가 프로토콜 버전 거부). 재시도도 같다 |
| KISA | `https://www.kisa.or.kr` | 해킹방어대회 등 | 불가 | 봇 UA에 403 |

## 6. 세미나·컨퍼런스·밋업 모음

| 사이트 | URL | 다루는 것 | 읽기 | 메모 |
| --- | --- | --- | --- | --- |
| 이벤터스 | `https://event-us.kr` | 세미나·컨퍼런스·대회 신청 | 숨은 API(POST) | 국비 학원 모집이 섞인다. 30건 중 개발 6. 약관: 비회원 포함 복제·제3자 제공 금지(영리·비영리) |
| 온오프믹스 | `https://onoffmix.com` | 행사 신청 | 불가 | robots 전체 금지 |
| Festa | `https://festa.io` | 개발 행사 신청 | 불가 | "Coming Soon" 화면뿐 |
| Meetup | `https://www.meetup.com` | AWSKRUG 등 커뮤니티 모임 | 내장 데이터 | 그룹별 페이지. ETag 304. 약관 원문은 Cloudflare 확인 화면이라 못 받았다 |
| Luma | `https://luma.com/seoul` | 서울 행사 캘린더 | 내장 데이터 | 12건 중 개발 3. 약관: 공개 인터페이스 외 접근 금지 |
| ticketa | `https://ticketa.co` | 행사 신청 | 숨은 API(GET) | 134건 한 번에. 예정 22건 중 개발 12. 약관: 크롤링 조항 없음, 회원 복제·배포 금지 |
| GDG | `https://gdg.community.dev` | GDG 챕터 행사, DevFest | 내장 데이터 | GDG 서울 예정 0건. 연 3~4회 |
| OKKY | `https://okky.kr/events/it` | IT 행사·공모전 게시판 | SSR | 모집 글이 섞인다. `?page=N` 동작. 약관: 자동 게시·변조만 금지 |
| AWS 코리아 이벤트 | `https://aws.amazon.com/ko/events/` | AWS 행사·웨비나 | SSR | 허브는 행사 종류 카드뿐이다. 약관: robots·data mining 도구 사용은 라이선스 밖 |
| 요즘IT | `https://yozm.wishket.com/magazine/` | IT 매거진. 행사 모음 기사가 올라온다 | 공식 RSS | `Crawl-delay: 5`. RSS 30건 중 행사 글 1 |
| Dev-Event | `https://github.com/brave-people/Dev-Event` | 월별 개발자 행사 큐레이션 | 불가(봇) | 개인 열람·링크 공유만 허용한다. 자동 수집·재배포는 서면 허가가 필요하다 |

## 7. 네임드 컨퍼런스 공식 사이트

목록이 아니라 행사 하나의 페이지다. 1년에 1~2번 바뀐다.

| 행사 | URL | 주최 | 첫 화면 상태 |
| --- | --- | --- | --- |
| if(kakao) | `https://if.kakao.com` | 카카오 | SSR. 2026.10.13~14 종료. 공지는 tech.kakao.com RSS |
| DEVIEW | `https://deview.kr` | 네이버 | SSR(아카이브). 마지막 회차 2023. 2024부터 DAN에 통합(검색 근거) |
| DAN | `https://dan.naver.com` | 네이버 | CSR. `/25`로 연결, `/26`은 404. DAN25는 2025.11.6~7(검색 근거) |
| 우아콘 | `https://woowacon.com` | 우아한형제들 | CSR. 2026.10.28 하루 예정. 공지는 기술 블로그 RSS |
| SLASH | `https://toss.im/slash-24` | 토스 | SSR. `slash-25`·`slash-26`은 404. 2025 이후 개최 근거 없음 |
| NDC | `https://ndc.nexon.com` | 넥슨 | CSR. NDC26 2026.6.16~18 종료 |
| FEConf | `https://2026.feconf.kr` | 프론트엔드개발그룹 | SSR. 2026.10.24 예정. 루트 `feconf.kr`의 meta refresh는 2025로 간다 |
| PyCon Korea | `https://2026.pycon.kr` | 파이콘 한국 | CSR. 2026.8.15~16 종료. AI 학습 봇 금지 |
| 드로이드나이츠 | `https://droidknights.dev` | 안드로이드 커뮤니티 | SSR. 2026.11.2 예정 |
| let'swift | `https://letswift.kr` | iOS 커뮤니티 | 루트는 `/2026/` 연결용 페이지. `/2026/`은 SSR과 `.ics`. 2026.10.8 워크숍 종료 |
| GopherCon Korea | `https://gophercon.kr` | Go 커뮤니티 | CSR. 제목 "GopherCon Korea 2025". 2026 개최 미확인 |
| JSConf Korea | `https://jsconf.kr` | JS 커뮤니티 | SSR. `2022.jsconf.kr`로 연결. 2022 이후 회차 없음 |
| 인프콘 | `https://infcon.day` | 인프런 | SSR. `infcon-2024`로 연결. 2025 휴식 공지(검색 근거) |
| AWS Summit Seoul | `https://aws.amazon.com/ko/events/summits/seoul/` | AWS | SSR. 2026.5.20~21 종료. 약관: robots 사용은 라이선스 밖 |
| AI Summit Seoul & Expo | `https://www.aisummit.co.kr` | DMK Global·COEX·KITA | SSR. 다음 회차 2027.8.11~13 공지. 제목은 아직 2026 |
| AI EXPO KOREA | `https://aiexpo.co.kr` | 한국인공지능협회·서울메쎄·인공지능신문 | SSR. 전시회. 2026.5.6~8 종료. 매년 4~5월 |

주소가 사라졌거나 열리지 않는 행사:

- Spring Camp: `springcamp.io` DNS 없음. ticketa 목록에 "스프링캠프 2026"이 지난 행사로 있다
- SDC Korea(삼성 개발자 컨퍼런스): `sdc-korea.com` DNS 없음
- SOSCON(삼성 오픈소스 컨퍼런스): `soscon.net` DNS 없음
- NHN FORWARD: `forward.nhn.com`이 NHN Cloud 유튜브 채널로 연결
- SK AI Summit: `skaisummit.com` 연결 시간 초과(2026-10-23 재시도도 15초 시간 초과). 2025 회차는 2025.11.3~4 코엑스(검색 근거)
- KGC(한국게임개발자컨퍼런스): `www.kgc.or.kr`, `kgc.or.kr` 모두 인증서 이름 불일치. 최근 회차 근거 없음(검색 근거)

## 8. 공공기관

| 기관 | URL | 다루는 것 | 읽기 | 메모 |
| --- | --- | --- | --- | --- |
| 오픈소스 포털(NIPA) | `https://www.oss.kr` | 오픈소스 개발자대회, 행사 안내 | 운영 | |
| NIPA | `https://www.nipa.kr` | 사업공고 | SSR | 행사 전용 게시판이 없다. 10건 중 개발 0 |
| NIA | `https://www.nia.or.kr` | 공지 | SSR | 행사 전용 게시판이 없다. 저작권 정책: 링크·인용 사전 협의, 세부화면 링크 금지 |
| 한국콘텐츠진흥원 | `https://www.kocca.kr` | 게임·콘텐츠 사업공고 | 불가 | robots가 목록 경로(`/kocca/*/list.do`, `/kocca/bbs/list/*.do`)를 막는다. 첫 화면만 허용 |
| AI·SW중심대학협의회 | `https://www.swuniv.kr` | AI·SW중심대학 디지털 경진대회 주관 | SSR | 공지 "타기관 홍보"에 외부 대회가 섞인다. 약관 페이지는 robots 금지. 경진대회는 DACON에도 올라온다(236693) |
| K-Startup | 공공데이터포털 오픈API | 창업 경진대회·사업공고 | 공식 API | 목록 페이지는 robots 금지. 이용허락범위 "제한 없음" |
| IITP | `https://www.iitp.kr` | 사업공고 | 불가 | robots 전체 금지 |
| 한국데이터산업진흥원 | `https://www.kdata.or.kr` | 데이터 경진대회 | 불가 | robots 전체 금지 |

## 9. 서비스 종료·해당 없음 (2026-10-23 확인)

- 캠퍼스몬(잡코리아): 잡코리아 공지 "[사전공지] 캠퍼스몬 서비스 종료 안내"로 연결된다. robots 전체 금지
- AI CONNECT: 첫 화면 제목이 "AI CONNECT 서비스 종료 안내"다
- 로켓펀치: Cloudflare 확인 화면(403)
- 커리어리: 첫 화면에서 행사 목록 링크를 찾지 못했다
- 이전 조사분(인프런, 구름 대회 목록, 네이버 카페 등): [SOURCE_CANDIDATES.md](SOURCE_CANDIDATES.md)의 "읽을 수 없음·해당 없음·제외"
