# 개발 행사 알림 봇 설계

작성일: 2026-10-25

## 왜 만드나

Mattermost 채널에 모인 친구들에게 국내 개발 행사 소식을 보내는 봇이다. 행사 종류는 공모전·경진대회·해커톤·컨퍼런스·세미나·외부 동아리다.

사용자가 든 예시:

- 현대자동차그룹 차량용 앱 개발 공모전 (`appdevchallenge.auto-hmg.io`)
- 빅콘테스트 (`bigcontest.or.kr`)
- OpenAI Game Builders Seoul (`openaigame2026.com`)
- AUSGCON (`ausg.me/ausgcon`)

성공한 모습: 알림을 본 친구가 채널에서 "이 대회 같이 나갈 사람!", "이거 같이 보러 갈 사람!" 하고 사람을 모으는 것. 그 대화는 사람이 Mattermost 기능으로 한다. 봇은 알림만 보낸다.

이 저장소에서 같은 봇을 한 번 만들었다가 2026-10-25에 접었다. 결정이 너무 복잡해져서 사용자가 무엇을 결정하는지 모르게 됐기 때문이다. 이번에는 아주 가볍게 만든다.

## 목표

- 정해진 사이트 7곳에서 새로 올라온 행사를 찾아 Mattermost 채널로 보낸다.
- 매일 9:00과 15:00(한국 시간)에 보낸다.
- 같은 행사는 한 번만 보낸다.

## 비목표

- 개발 행사인지 판정하거나 키워드로 거르는 것. 찾은 건 다 보낸다.
- 주최가 유명한지 판정하는 것.
- 행사 상세 페이지를 읽거나 일정·마감일을 뽑는 것.
- 웹사이트, 개인 알림, 스레드 관리나 사람 모으기 기능.
- Discord 지원.

## 안티 목표

- 복잡해지는 것. 설정 항목, 추상화 계층, 선택 옵션을 늘리지 않는다. 사용자가 코드를 보고 무엇이 어떻게 도는지 바로 알 수 있어야 한다.
- 돈이 드는 것.

## 제약

- 무료만 쓴다. 저장소 `seophohoho/jakdang`은 비공개라 GitHub Actions 한도가 월 2,000분이다. 예상 사용량은 하루 2회 × 30일 × 1~2분 = 월 60~120분이다.
- 요청 예의:
  - robots.txt를 지킨다.
  - 같은 호스트에는 1초 이상 간격을 둔다.
  - 봇임을 밝히는 User-Agent를 쓴다. 지난번에 쓴 값은 `Mozilla/5.0 (compatible; jakdang-event-bot/0.1; personal developer event notifier)`이다. oss.kr은 `Mozilla/5.0 (compatible; …)` 형식이 아니면 403을 줬다.
  - 브라우저로 위장하지 않는다.
  - 로그인, 차단 우회, 상세 페이지 요청은 하지 않는다. 목록만 읽는다.

## 사용자가 정한 것

- 알림 플랫폼: Mattermost. 이미 있는 incoming webhook을 쓴다. 주소는 Mattermost 설정 화면에서 확인한다.
- 실행 환경: GitHub Actions `schedule`.
- 실행 시각: 매일 9:00, 15:00 KST. GitHub 정각 지연(정각에 몰리면 늦어지거나, 아주 붐비면 빠짐)은 알고 받아들였다.
- 읽을 사이트: 아래 7곳 전부.
- 보낼 것: 찾은 것 전부. 개발이 아닌 행사가 섞이는 것을 받아들였다.
- 컨퍼런스·세미나·외부 동아리 소식은 OKKY 한 곳에만 기대는 것을 받아들였다.
- 중복 제거는 사이트 안에서만 한다. 사이트끼리 제목을 비교하지 않는다. 같은 공모전이 여러 사이트에 올라오면 사이트 수만큼 알림이 간다. 겹치는 알림이 거슬릴 만큼 많아지면 다시 정한다.
- 알림 모양은 Mattermost 마크다운이다. 제목은 `##`(h2)로, 내용은 목록(li)으로 쓴다. 내용에는 사이트 이름과 링크만 넣는다. 주최나 접수 기간은 넣지 않는다. 친구들이 링크를 안 누르고 넘기는 일이 많아지면 다시 정한다.
  ```
  ## 현대자동차그룹 차량용 앱 개발 공모전
  - 사이트: 위비티
  - 링크: https://www.wevity.com/?c=find&s=1&gbn=view&ix=111802
  ```
- 한 회차에 새 글이 아무리 많아도 다 보낸다. 사이트가 링크 모양을 바꾼 날에는 수십 건이 한꺼번에 갈 수 있다. 실제로 쏟아져서 친구들이 불편해하면 다시 정한다.
- Dev-Event(`brave-people/Dev-Event`)는 라이선스가 자동 수집·재배포를 금지해서 쓰지 않는다.
- 4곳(DACON·올콘·씽굿·씽유)은 약관에 "얻은 정보를 타인에게 제공하지 말라"는 조항이 있다. 이를 안 뒤에 7곳 전부를 골랐다.
- 인증서 체인이 불완전한 사이트(2026-10-26 기준 올콘)는 실행 중에 보완한다. 연결이 `UNABLE_TO_VERIFY_LEAF_SIGNATURE`로 실패하면 그 사이트 인증서의 AIA 주소에서 중간 인증서를 받는다. 그 중간 인증서가 사이트 인증서에 서명했고 Node 기본 루트가 그 중간 인증서에 서명했을 때만 이번 실행 동안 믿고, 한 번 다시 시도한다. 인증서 파일을 저장소에 넣어 두는 방식은 쓰지 않는다.

## Claude가 정한 것 (사용자 이의 없음)

- 보낸 목록: 저장소 안의 JSON 파일 하나에 둔다. 실행이 끝날 때 Actions가 커밋한다.
- 첫 실행: 보내지 않고 지금 목록을 기억만 한다. 그래서 지금 열려 있는 행사(예: 11/15에 마감하는 현대차 공모전)는 알림이 가지 않는다.
- 행사 하나당 글 하나를 보낸다.
- 고장 처리: 사이트 하나가 안 읽히면 그곳만 건너뛰고 나머지는 보낸다. 그 회차는 실패로 끝낸다. 그러면 GitHub가 실패 메일을 보낸다.
- 언어와 실행 환경: TypeScript, Node.js.
- 웹훅 주소는 GitHub Secret에 둔다.

## 사이트 7곳

아래 내용은 2026-10-22~23 조사 기록(커밋 `5c228f6`에서 지운 `docs/SOURCES.md`, `docs/SOURCE_CANDIDATES.md`)에서 가져왔다. 한 번 찍은 스냅샷이라 구현 전에 사이트마다 다시 확인해야 한다. 같은 기록에 있던 ticketa 숨은 API는 2026-10-25에 이미 응답이 바뀌어 있었다.

"숨은 API"는 공개 약속 없이 사이트 스크립트가 쓰는 데이터 주소다. 예고 없이 바뀔 수 있다.

### 1. 위비티 (웹/모바일/IT 공모전)

- 목록: `https://www.wevity.com/?c=find&s=1&gub=1&cidx=20`
- 읽기: 서버가 그린 HTML. 컨테이너 `div.ms-list > ul.list`, 항목 `li:not(.top)`, 제목·링크 `div.tit > a`. 제목 속 `span`(SPECIAL·신규 배지)은 뺀다.
- 항목 ID: 링크의 `ix` 값. 정규 링크: `https://www.wevity.com/?c=find&s=1&gbn=view&ix=<ix>`
- 페이지: `gp=<n>`, 페이지당 약 15건. 1페이지 맨 위에 광고(SPECIAL) 7건이 고정된다.
- 약관: 상업적 이용만 금지한다. 자동 수집 금지 조항은 없다.
- 지난번에 실제로 운영한 곳이다.

### 2. DACON (AI·데이터 대회)

- 목록: `https://dacon.io/competitions`
- 읽기: 서버가 그린 HTML(약 770KB). 컨테이너 `div.official-comp`, 항목 `div.comp > a`, 제목 `p.name`.
- 항목 ID: `/competitions/official/<id>/`의 숫자. 정규 링크: `https://dacon.io/competitions/official/<id>/overview/`
- 페이지 구분이 없다. 15건 안팎이 보인다. 응답에 `ETag`가 있다.
- 약관(2026-08-21 시행) 제21조 7항: 회원은 얻은 정보를 타인에게 제공할 수 없다.

### 3. 올콘 (개발 분류)

- 화면: `https://www.all-con.co.kr/list/contest/1`
- 읽기: 숨은 API. `POST https://www.all-con.co.kr/page/ajax.contest_list.php`, 폼 인코딩 본문 `sortorder=asc&page=1&sortname=cl_order&ct[]=5&sc[]=31&stx=&sfl=&rows=15&t=1`. 응답은 JSON인데 헤더가 `text/html`이다.
- 데이터: `rows[]`의 `cl_srl`(ID), `cl_title`(배지 HTML 섞임), `cl_host`.
- 스냅샷: 15건 중 개발 12.
- 약관: 회원은 사전 승낙 없이 복제·유통할 수 없다.

### 4. 씽굿 (게임/소프트웨어)

- 화면: `https://www.thinkcontest.com/thinkgood/user/contest/index.do`
- 읽기: 숨은 API. `POST https://www.thinkcontest.com/thinkgood/user/contest/subList.do`, JSON 본문 `{"recordsPerPage":20,"currentPageNo":1,"contest_field":"CCFD002","host_organ":"","enter_qualified":"","award_size":"","searchStatus":"Y","sidx":"putup_sdt","sord":"DESC"}`
- 데이터: `listJsonData[]`의 `contest_pk`(ID), `program_nm`(제목). 응답에 담당자 개인정보 칸이 있으니 저장하지 않는다.
- 스냅샷: 10건 중 개발 6.
- 약관: 이용자는 얻은 정보를 제3자에게 이용하게 할 수 없다.

### 5. OKKY (IT 행사)

- 목록: `https://okky.kr/events/it`
- 읽기: 서버가 그린 HTML. 링크 `a[href^="/articles/"]`(빈 이미지 링크 제외). 같은 HTML의 `self.__next_f` 조각에 `content[].{id, title}` JSON도 있다.
- 항목 ID: `/articles/{id}`. 페이지: `?page=N`
- 스냅샷: 20건 중 개발 8. 모집 글이 섞인다. 2026-10-25에 4페이지에서 "AUSGCON 2026으로 여러분을 초대합니다" 글을 확인했다.
- 2026-10-25에 받은 1페이지는 46KB였고, 2~5페이지는 약 180KB였다. 1페이지 응답 구조를 따로 확인해야 한다.
- 약관: 자동으로 글을 올리거나 고치는 것만 금지한다.

### 6. 씽유 (IT·SW)

- 목록: `https://thinkyou.co.kr/contest/?page=1&pagesize=45&serstatus=&serdivision=&serfield=5&sertarget=&serprizeMoney=&seritem=0&searchstr=`
- 읽기: 서버가 그린 HTML. 행 `div.tr`(고정 공지 `div.tr.notice`), 제목 `div.title a dl dt h3`
- 항목 ID: `/contest/{id}/`
- 스냅샷: 33건 중 개발 13. 비개발 13건 중 7건은 교육생 모집이다. DACON 대회가 "데이콘 …"으로 다시 올라온다.
- 약관: 이용자는 얻은 정보를 제3자에게 이용하게 할 수 없다.

### 7. 콘테스트코리아 (학문·과학·IT)

- 목록: `https://www.contestkorea.com/sub/list.php?int_gbn=1&Txt_bcode=030310001`
- 읽기: 서버가 그린 HTML. 항목 `div.list_style_2 > ul > li`, 제목 `div.title a span.txt`
- 항목 ID: 링크의 `str_no`(12자리). 목록 밖에도 `str_no=` 링크가 많으니 목록 영역 안에서만 뽑는다.
- 정렬이 `Txt_sortkey=a.int_sort`라 1페이지가 날짜순이 아니다. 등록일순 정렬 방법은 아직 모른다.
- 스냅샷: 12건 중 개발 4.
- 약관: 상업적 이용만 금지한다.

## 빌더에게 맡기는 것

- 사이트별로 읽을 페이지 수. 기본은 첫 페이지다. 단, 하루 2회 사이에 올라오는 새 글을 놓치지 않을 만큼은 읽는다.
- 콘테스트코리아에서 새 글을 잡는 방법(정렬 파라미터 등).
- 사이트마다 "실패"로 볼 기준. 예를 들면 HTTP 오류, 목록 영역을 못 찾음, 0건.
- 항목 ID와 링크를 정규화하는 세부 방식.
- 보낸 목록 파일의 형식과, 파일이 커질 때 관리하는 방법.
- Mattermost로 여러 건을 보낼 때의 간격.
- 테스트 방식. 실제 페이지를 줄여 담은 fixture를 쓰는 것을 권한다.
- 사이트를 나중에 새로 추가할 때 그 사이트의 첫 실행도 "기억만" 하게 할지.
