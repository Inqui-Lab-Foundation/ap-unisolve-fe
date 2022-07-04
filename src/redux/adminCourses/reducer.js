// Foulders Reducers //
import {
  ADMIN_COURSES_LIST,
  ADMIN_COURSES_LIST_SUCCESS,
  ADMIN_COURSES_LIST_ERROR,
  ADMIN_COURSES_DETAILS,
  ADMIN_COURSES_DETAILS_SUCCESS,
  ADMIN_COURSES_DETAILS_ERROR,
  ADMIN_COURSES_CREATE,
  ADMIN_COURSES_CREATE_SUCCESS,
  ADMIN_COURSES_CREATE_ERROR,
} from "../actions";

const INIT_STATE = {
  loading: false,
  error: "",
  successMessage: "",
  adminCoursesList: [],
  adminCoursesDetails: {},
};

export default (state = INIT_STATE, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ADMIN_COURSES_LIST:
      return { ...state, loading: true, error: "" };
    case ADMIN_COURSES_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        adminCoursesList: action.payload.data,
        error: "",
      };
    case ADMIN_COURSES_LIST_ERROR:
      return {
        ...state,
        loading: false,
        adminCoursesList: [],
        error: action.payload.message,
      };
    case ADMIN_COURSES_CREATE:
      return { ...state, loading: true, error: "" };
    case ADMIN_COURSES_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
        error: "",
      };
    case ADMIN_COURSES_CREATE_ERROR:
      return {
        ...state,
        loading: false,
        currentUser: null,
        successMessage: "",
        error: action.payload.message,
      };
    case ADMIN_COURSES_DETAILS:
      return { ...state, loading: true, error: "" };
    case ADMIN_COURSES_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        adminCoursesDetails: action.payload.data,
        error: "",
      };
    case ADMIN_COURSES_DETAILS_ERROR:
      return {
        ...state,
        loading: false,
        adminCoursesDetails: {},
        error: action.payload.message,
      };
    default:
      return newState;
  }
};