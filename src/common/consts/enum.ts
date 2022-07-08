function getEnumToArray(enumType) {
  return Object.keys(enumType)
    .filter((value) => isNaN(Number(value)) === false)
    .map((key) => `${key} : ${enumType[key]}`);
}

function getEnumTypeValues(enumType) {
  return Object.keys(enumType)
    .map((key) => enumType[key])
    .filter((value) => typeof value === 'number');
}

enum STATUS_TYPE {
  NORMAL = 'normal',
  FORBIDDEN = 'forbidden',
  SIGNOUT = 'signOut',
}

//카테고리 타입 한글로
enum CATEGORY_TYPE {
  UNIVERSITY = 'UNIVERSITY', //대학교
  CONCERTHALL = 'CONCERTHALL', //공연장
  HAN_RIVER_PRAK = 'HANRIVERPRAK', //한강공원
  STADIUM = 'STADIUM', // 경기장
  EXHIBITION = 'EXHIBITION', //박람회 전시회
  AMUSEMENT_PARK = 'AMUSEMENTPARK', // 놀이공원
  DEPARTMENT_STORE = 'DEPARTMENTSTORE', //백화점
  // AMUSEMENT_PARK,
  // HAN_RIVER_PRAk,
}
enum FIND_ROOM_FILTER_TYPE {
  UNIVERSITY = 'UNIVERSITY', //대학교
  CONCERTHALL = 'CONCERTHALL', //공연장
  HAN_RIVER_PRAK = 'HANRIVERPRAK', //한강공원
  STADIUM = 'STADIUM', // 경기장
  EXHIBITION = 'EXHIBITION', //박람회 전시회
  AMUSEMENT_PARK = 'AMUSEMENTPARK', // 놀이공원
  DEPARTMENT_STORE = 'DEPARTMENTSTORE', //백화점

  ALL = 'ALL',
  FAVORITE = 'FAVORITE',
  // AMUSEMENT_PARK,
  // HAN_RIVER_PRAk,
}

enum EVENT_TYPE {
  CHAT = 1,
  QUESTION,
  NOTI,
  AVOCADO,
}

enum SEX_TYPE {
  MALE = 1,
  FEMALE,
}

enum USER_TYPE {
  OPENING = 1,
  UN_OPENING,
  STUDENT,
}

enum REQ_STATE_TYPE {
  WAIT = 1,
  RETURN,
  CHECKING,
  APPROVAL,
  CANCEL,
}

enum LOGIN_ERROR_CODE {
  NOT_EXIST_ID,
  NOT_MATCH_AUTH_DATA,
  LOGIN_LOCK,
  LOGIN_UN_ACTIVE,
}

enum TOKEN_ERROR_CODE {
  NOT_EXIST_TOKEN,
  TOKEN_EXPIRED,
  NOT_VALID_TOKEN,
  NOT_ACCOUNT,
}

enum ACCOUNT_TYPE {
  USER = 1,
  OPERATOR,
}

enum CONTENT_TYPE {
  COMMENT = 1,
  VIEW,
  SCRAP,
  LIKE,
}

enum SORT_TYPE {
  POPULARITY = 1,
  LATEST,
}

enum NOTIFICATION_POST_TYPE {
  USER_NOTI = 1,
  OPERATOR_WEB_NOTI,
  OPERATOR_WEB_MAIN,
}

//카테고리 타입 한글로
enum QUESTION_FIND_FILTER_TYPE {
  NOTANSWERED = 'NOTANSWERED', // 답변못받은거
  OLDORDER = 'OLDORDER', //오래된순
  NEWORDER = 'NEWORDER', //최신순
  RECENT = 'RECENT', //최신순
}

enum USER_LEVEL_TYPE {
  LEVEL0 = 0, //대학교
  LEVEL1 = 1, //공연장
  LEVEL2 = 2, //한강공원
  LEVEL3 = 2, //한강공원
}

enum USER_LEVELUP_COUNT_TYPE {
  LEVEL0 = 0, //대학교
  LEVEL1 = 5, //공연장
  LEVEL2 = 25, //한강공원
  LEVEL3 = 100, //한강공원
}

enum PUSH_ALARM_TYPE {
  COMMENT = 'comment',
  LETTER = 'letter',
  CHAT = 'chat',
  LIGHTNING_LEVELUP = 'lightningLevelUp',
  LIGHTNING = 'lightning',
}

// enum ALARM_TYPE {
//   COMMENT = 'comment',
//   LETTER = 'letter',
//   CHAT = 'chat',
//   OFFICIAL = 'official',
//   LIGHTNING = 'lightning',
//   LIGHTNING_LEVELUP = 'lightningLevelUp',
// }

enum ALARM_STORE_TYPE {
  // 댓글 줬을때
  COMMENT = 'comment',
  // 번개 줬을 떄
  LIGHTNING = 'lightning',

  // 번개 라이트닝 레벨업?
  // LIGHTNING = 'lightning',
  // 시스템 전부 공지알림
  OFFICIAL = 'official',
}

const PUSH_ALARM = 'pushAlarm';
const SAVE_ALARM = 'saveAlarm';

const DEEPLINK_BASEURL = 'tiquitaca-app://navigation/';

enum CHAT_TYPE {
  NORMAL = 0,
  QUERY = 1,
}

export {
  CHAT_TYPE,
  DEEPLINK_BASEURL,
  PUSH_ALARM_TYPE,
  ALARM_STORE_TYPE,
  PUSH_ALARM,
  SAVE_ALARM,
  // ALARM_TYPE,
  USER_LEVELUP_COUNT_TYPE,
  USER_LEVEL_TYPE,
  QUESTION_FIND_FILTER_TYPE,
  getEnumToArray,
  getEnumTypeValues,
  SEX_TYPE,
  USER_TYPE,
  REQ_STATE_TYPE,
  LOGIN_ERROR_CODE,
  TOKEN_ERROR_CODE,
  ACCOUNT_TYPE,
  CONTENT_TYPE,
  SORT_TYPE,
  NOTIFICATION_POST_TYPE,
  STATUS_TYPE,
  CATEGORY_TYPE,
  EVENT_TYPE,
  FIND_ROOM_FILTER_TYPE,
};
