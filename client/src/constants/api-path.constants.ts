export const API_BASE_URL = "http://localhost:8080/api";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  PASSWORD_RESET: {
    REQUEST: "/password-reset/request",
    VALIDATE: "/password-reset/validate",
    SUBMIT: "/password-reset/submit",
  },
  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: (id: string) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  ROLES: {
    GET_ALL: "/roles",
  },
  USER_ROLES: {
    GET_ALL: "/user-roles",
    GET_BY_USER_ID: (userId: string) => `/user-roles/user/${userId}`,
  },
  STUDENTS: {
    GET_ALL: "/students",
    GET_BY_ID: (id: string) => `/students/${id}`,
    GET_BY_CODE: (code: string) => `/students/code/${code}`,
    GET_BY_USER_ID: (userId: string) => `/students/user/${userId}`,
    CREATE: "/students",
    UPDATE: (id: string) => `/students/${id}`,
    DELETE: (id: string) => `/students/${id}`,
  },
  TEACHERS: {
    GET_ALL: "/teachers",
    GET_BY_ID: (id: string) => `/teachers/${id}`,
    CREATE: "/teachers",
    UPDATE: (id: string) => `/teachers/${id}`,
    DELETE: (id: string) => `/teachers/${id}`,
  },
  NOTIFICATIONS: {
    GET_ALL_BY_USER: (userId: string) => `/notifications/${userId}`,
    CREATE: "/notifications",
    MARK_AS_SEEN: (id: string) => `/notifications/${id}/seen`,
    UPDATE_RESPONSE: (id: string) => `/notifications/${id}/response`,
    DELETE: (id: string) => `/notifications/${id}`,
  },
  TUITIONS: {
    GET_ALL: "/tuitions",
    GET_BY_ID: (id: string) => `/tuitions/${id}`,
    CREATE: "/tuitions",
    UPDATE: (id: string) => `/tuitions/${id}`,
    DELETE: (id: string) => `/tuitions/${id}`,
  },
  TIME_REGISTERS: {
    GET_ALL: "/time-registers",
    GET_BY_ID: (id: string) => `/time-registers/${id}`,
    GET_BY_TYPE_SEMESTER: (typeSemester: string) => `/time-registers/type-semester/${typeSemester}`,
    GET_BY_TYPE_REGISTER: (typeRegister: string) => `/time-registers/type-register/${typeRegister}`,
    SEARCH: "/time-registers/search",
    CREATE: "/time-registers",
    UPDATE: (id: string) => `/time-registers/${id}`,
    DELETE: (id: string) => `/time-registers/${id}`,
  },
} as const;
