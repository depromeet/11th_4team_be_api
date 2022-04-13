# 11th_4team_be_api - Project Title (TIKITAKA: 티키타카)

#### - ⚽️티키타카⚽️는 (같은 공간내 채팅 서비스입니다.

#### - 해당 레퍼지토리는 api를 관리하는 백엔드 소스들로 구성되었습니다.

---

# 2. Getting Started

### 2_1. Prerequisites / 선행 조건

아래 사항들이 설치가 되어있어야합니다.

```
Node.js
Nest.js
```

### 2_2. Installing

#### 1. 저장소 클론하고 패키지 설치

```shell script
$ git clone https://github.com/{YOUR_ID}/{REPOSITORY_NAME}.git  # git clone https://gitlab.ubware.com/git/management-consulting.git

$ Username for 'https://github.com': ubware ID
$ Password for 'https://gitlab.com': ubware PSW
$ cd {REPOSITORY_NAME} # cd REPOSITORY_NAME
$ npm install
```

#### 2. 깃 리무트 브랜치 가져오기

```shell script
$ git branch -r # -r 옵션 주면 원격 저장소의 branch 리스트 보기
$ git branch -a #/ -a 옵션 주면 로컬, 원격 모든 저장소의 branch 리스트 보기
$ git checkout -t origin/{BRANCH_NAME} # 원격 저장소 branch 가져오기
```

#### 3. 환경변수 파일, `.env`를 root 디렉토리 아래의 생성

```json
// .env
MONGO_URI=mongodb+srv://tikitakaBackend:oqcyeGUaODZ4fsD4@tikitaka.g7pos.mongodb.net/tikitaka?retryWrites=true&w=majority
PORT=8080
MODE=dev
JWT_SECRET=mysecret
SWAGGER_USER=minjae
SWAGGER_PASSWORD=1234
```

#### 4. `start:dev` 스크립트를 통해 `http://localhost:{PORT}`에 로컬 서버 구동

```shell script
$ npm run start:dev
```

#### 5. `http://localhost:PORT/api-docs/`에서 api 문서 확인 가능(들어가서 아이디, 비밀번호 입력)

![](https://images.velog.io/images/minj9_6/post/d9277e13-23b5-45ab-b21e-25aabf8c31b6/image.png)
![](https://imagedelivery.net/v7-TZByhOiJbNM9RaUdzSA/990d6960-bc33-4591-7c16-1d9782380f00/public)

#### 6. api 테스트 시 참고사항

#### 6_1. admin

> - 관리자 전체 목록 조회
> - 비밀번호 재설정

#### 6_2. statistics

> - API 명

- 위에 해당하는 API 경우 토큰 필요 하므로 로그인 후 테스트 진행

#### 6_3. 해당 과정

> - 로그인 후 토큰 발급
>   ![](https://images.velog.io/images/minj9_6/post/bf4b0761-6f5f-4d53-9987-cca248d016b5/image.png)
> - Authorize 클릭
>   ![](https://images.velog.io/images/minj9_6/post/0258515a-46e1-4c19-8850-48c34ec8e32c/image.png)
> - 발급 받은 토큰 입력하여 로그인
>   ![](https://images.velog.io/images/minj9_6/post/a60b90c5-efd1-4bb0-8a7e-7fd2d9d635df/image.png)

---

## 3. Running the tests / 테스트가 시스템에서 돌아가는지에 대한 설명

### 테스트는 이런 식으로 동작합니다.

```
예시1
```

### 테스트 작성 예시

```
예시2
```

---

## 4. Deployment

#### 라이브 시스템을 배포하는 방식입니다.

---

## 5. Project Structure

#### 5_1. 프로젝트 디렉토리 구조(환경변수 파일인 .env.dev 파일 요청시 전달)

![](https://images.velog.io/images/minj9_6/post/b979caf2-f4b1-4462-9be0-278f0243858e/image.png)

#### 5_2. src 디렉토리 구조

![](https://images.velog.io/images/minj9_6/post/ff362f9b-544e-4b9e-ba28-49943110611a/image.png)

#### 5_3. 프로젝트 구조 상세 설명

 [apis]: restapi로 구성

-  Admin: 관리자 회원 api
-  Statistics: 알파앤 현황 api
  - 각각의 api 내부에 dtos 폴더 존재

 [auth]: 인가와 관련된 모듈

- guards : 가드를 모아놓은 폴더
- interfaces : 인터페이스 폴더
- strategies : 전략을 모아놓은 폴더

 [business]: 외부 라이브러리 등 복잡한 비즈니스 로직이 들어간 api 집합 / 내부 파일 없어서 현재 삭제

 [common]: 공통으로 쓰이는 사항을 모아놓은 폴더

- const : 상수 관련된 변수를 모아놓은 폴더
- decorators : 커스텀 데코레이터 모아놓은 폴더
- dtos : 공통적으로 쓰이는 dto 모아놓은 폴더
- entities : 공통적으로 쓰이는 entities 모아놓은 폴더
- func : 공통적으로 쓰이는 함수 모아놓은 폴더

 [config]: 환경 설정 관련 코드를 모아놓은 폴더

 [middlewares]: 라우터 핸들러 이전에 호출되는 함수(미들웨어) 집합 / 내부 파일 없어서 현재 삭제

 [entities]: DB의 테이블과 매핑되는 class(DB 모델 유사)

 [repositories]: DB 관련된 CRUD 로직을 처리하기 위한 저장소 집합 / 내부 파일 없어서 현재 삭제

 [util]: swagger 생성등 특정작업에 실행되는 로직 집합

 [test]: test 관련 소스코드 집합

---

## 6. Update state

---

## 7. Built With

- [김우진]() -
- [이찬진]() -
- [김민재]() - 프로젝트 생성 및 초기세팅

### Contribution / PR 양식

- [CONTRIBUTING.md]() 를 읽고 이에 맞추어 pull request 요청 바람

### License

- 이 프로젝트는 디프만[LICENSE](LICENSE.md)이 부여. 자세한 내용은 LICENSE.md 파일을 참고
