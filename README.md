# COFEE

# ✨주제: 코드 피드백(code feedback)

## 내용
- 매일 쏟아지는 에러와 싸워야하는 개발자들을 위한 질문 및 피드백 사이트
- 스택오버플로워에 영어만 있어 정보를 얻기 힘들었다면 cofee에서 커피 한 잔 하며 쉽게 정보를 얻을 수 있습니다.

<br>

## 💁‍♂️팀원 소개
- BE: 김윤보, 송민지, 문광민
- FE: 김정욱, 박태형

<br>

## 💻기술 스택
📌 BackEnd

<img src="https://img.shields.io/badge/javascript-333333?style=flat-square&logo=javascript&logoColor=yellow"/> <img src="https://img.shields.io/badge/mysql-3333ff?style=flat-square&logo=firebase&logoColor=white"/> 
<img src="https://img.shields.io/badge/express-666666?style=flat-square&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-33cc00?style=flat-square&logo=Node.js&logoColor=white"/>


<img src="https://img.shields.io/badge/NPM-33cc00?style=flat-square&logo=NPM.js&logoColor=red"/> <img src="https://img.shields.io/badge/JSON WEB TOKEN-333333?style=flat-square&logo=json web token&logoColor=white"/> <img src="https://img.shields.io/badge/AWS-ffcc33?style=flat-square&logo=AWS&logoColor=white"/> 



📌 Front-end

<img src="https://img.shields.io/badge/javascript-333333?style=flat-square&logo=javascript&logoColor=yellow"/> <img src="https://img.shields.io/badge/HTML-ff3300?style=flat-square&logo=HTML&logoColor=white"/> <img src="https://img.shields.io/badge/CSS-3366ff?style=flat-square&logo=CSS&logoColor=white"/>

<img src="https://img.shields.io/badge/react-33ffff?style=flat-square&logo=react&logoColor=black"/> <img src="https://img.shields.io/badge/REDUX-6600cc?style=flat-square&logo=REDUX&logoColor=white"/> <img src="https://img.shields.io/badge/REACT ROUTER-6600cc?style=flat-square&logo=REACT ROUTER&logoColor=white"/>

<br>

## :dizzy: 핵심기능
> 1) 회원가입/로그인

 + JWT 인증 방식으로 로그인 구현
 + ID 중복확인, 각 필드별 유효성체크

> 2) 게시글 CRUD
 + 게시글 목록 조회, 등록, 수정, 삭제
 + 상세조회
 + 좋아요 추가, 삭제
 + 태그 추가

> 3) 댓글 CRUD
 + 댓글 조회, 수정, 삭제

> 4) 검색 기능
 + 제목, 내용 검색 

> 5) 알람 기능
 + 내 게시글 좋아요, 댓글 추가 시 알람

<br>

## :tv: 데모영상
<img src="https://img.shields.io/badge/YouTube-FF0000?style=flat&logo=YouTube&logoColor=white"/>
https://www.youtube.com/watch?v=InTUrvCMZUk

<br>

## :key: 우리팀이 해결한 문제

> 1) 검색 기능 
 + 시퀄라이즈 쿼리를 이용해 구현 
 + [Op.or],[Op.like] 사용

> 2) 알람 기능 
 + 댓글 작성 및 좋아요 추가시 알람 테이블에 상태값, 댓글 또는 좋아요 한 사람을 저장 (미리 게시글과 알람 테이블 관계 설정)
 + 전체 게시글 조회 시 알람 테이블 데이터도 같이 보내기
 + 메인 페이지에서 알람 버튼 클릭 시 알람 테이블 상태값 기존 false -> true로 만들어 읽음 처리 된 알람 구분했음

> 3) 로그인 시 FE 요청에 따라 데이터 가공해서 전달
 + 기존에 JWT를 이용해 토큰 값만 전달했지만 로그인 한 사람을 FE에서도 구분하게 하기위해 result: true, nickname을 같이 전달
 
> 4) 좋아요 기능 
 + 초반 관계 설정을 잘못해 어려움을 겪음, User와 Post 관계를 N:M 설정하고 중간 테이블(Like) 설정
 + 전체 게시글 조회 시 관계 설정한 걸 바탕으로 게시글에 좋야요 한 user 리스트 FE에 전달
 

