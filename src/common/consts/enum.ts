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
  NORMAL = 1,
  FORBIDDEN,
}

//카테고리 타입 한글로
enum CATEGORY_TYPE {
  UNIVERCITY = 'UNIVERCITY', //대학교
  CONCERTHALL = 'CONCERTHALL', //공연장
  HAN_RIVER_PRAK = 'HAN_RIVER_PRAK', //한강공원
  STADIUM = 'STADIUM', // 경기장
  EXHIBITION = 'EXHIBITION', //박람회 전시회
  AMUSEMENT_PARK = 'AMUSEMENT_PARK', // 놀이공원
  DEPARTMENT_STORE = 'DEPARTMENT_STORE', //백화점
  // AMUSEMENT_PARK,
  // HAN_RIVER_PRAk,
}

enum FIND_ROOM_FILTER_TYPE {
  UNIVERCITY = 'UNIVERCITY', //대학교
  CONCERTHALL = 'CONCERTHALL', //공연장
  HAN_RIVER_PRAK = 'HAN_RIVER_PRAK', //한강공원
  STADIUM = 'STADIUM', // 경기장
  EXHIBITION = 'EXHIBITION', //박람회 전시회
  AMUSEMENT_PARK = 'AMUSEMENT_PARK', // 놀이공원
  DEPARTMENT_STORE = 'DEPARTMENT_STORE', //백화점

  ALL = 'ALL',
  FAVORITE = 'FAVORITE',
  // AMUSEMENT_PARK,
  // HAN_RIVER_PRAk,
}

enum CHAT_TYPE {
  CHAT = 1,
  QUESTION,
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

export {
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
  CHAT_TYPE,
  EVENT_TYPE,
  FIND_ROOM_FILTER_TYPE,
};
