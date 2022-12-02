import axios from 'axios';

import {
    GET_STUDENTS,
    GET_STUDENTS_LIST_ERROR,
    GET_STUDENTS_LIST_SUCCESS,
    UPDATE_STUDENT_STATUS,
    GET_STUDENT,
    GET_STUDENTS_LANGUAGE,
    GET_CHALLENGE_QUESTIONS,
    GET_CHALLENGE_SUBMITTED_DATA,
    GET_STUDENT_BADGES,
    GET_STUDENT_DASHBOARD_STATUS,
    GET_STUDENT_DASHBOARD_CHALLENGES_STATUS,
    GET_STUDENT_DASHBOARD_TEAMPROGRESS,
    GET_STUDENT_DASHBOARD_TUTORIALS,
    SET_PRESURVEY_STATUS,
} from '../actions';
import { URL, KEY } from '../../constants/defaultValues';
import { getNormalHeaders, openNotificationWithIcon } from '../../helpers/Utils';
import { getLanguage } from '../../constants/languageOptions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/media/badge.png';



export const getStudentListSuccess =
    (user) => async (dispatch) => {
        dispatch({
            type: GET_STUDENTS_LIST_SUCCESS,
            payload: user
        });
    };
export const getStudentGlobalLanguage =
    (language) => async (dispatch) => {
        dispatch({
            type: GET_STUDENTS_LANGUAGE,
            payload: language
        });
    };

export const getStudentSuccess =
    (user) => async (dispatch) => {
        dispatch({
            type: GET_STUDENT,
            payload: user
        });
    };

export const getStudentListError =
    (message) => async (dispatch) => {
        dispatch({
            type: GET_STUDENTS_LIST_ERROR,
            payload: { message }
        });
    };

export const getStudentRegistationData = (studentType) => async (dispatch) => {
    try {
        dispatch({ type: GET_STUDENTS });
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        let result;
        if (studentType && studentType === "above") {
            result = await axios
                .get(`${URL.getStudents}?adult=${true}`, axiosConfig)
                .then((user) => user)
                .catch((err) => {
                    return err.response;
                });
        } else {
            result = await axios
                .get(`${URL.getStudents}`, axiosConfig)
                .then((user) => user)
                .catch((err) => {
                    return err.response;
                });
        }
        if (result && result.status === 200) {
            const data =
                result.data &&
                result.data.data[0] &&
                result.data.data[0].dataValues;
            dispatch(getStudentListSuccess(data));
        } else {
            dispatch(
                getStudentListError(result.statusText)
            );
        }
    } catch (error) {
        dispatch(getStudentListError({}));
    }
};
export const getStudentByIdData = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_STUDENTS });
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.getStudentById}${id}`, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data =
                result.data &&
                result.data.data[0] &&
                result.data.data[0];
            dispatch(getStudentSuccess(data));
        } else {
            dispatch(
                getStudentListError(result.statusText)
            );
        }
    } catch (error) {
        dispatch(getStudentListError({}));
    }
};

export const updateStudentStatus = (data, id) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_STUDENT_STATUS });
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .put(`${URL.updateStudentStatus + id}`, data, axiosConfig)
            .then((user) => console.log(user))
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            // const data =
            //     result.data &&
            //     result.data.data[0] &&
            //     result.data.data[0].dataValues;
            // dispatch(getAdminMentorsListSuccess(data));
        } else {
            dispatch(
                getStudentListError(result.statusText)
            );
        }
    } catch (error) {
        dispatch(
            getStudentListError({})
        );
    }
};

export const getChallengeQuestionsSuccess =
    (questions) => async (dispatch) => {
        dispatch({
            type: GET_CHALLENGE_QUESTIONS,
            payload: questions
        });
    };


export const getStudentChallengeQuestions = (language) => async (dispatch) => {
    try {
        // dispatch({ type: GET_STUDENTS });
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.getChallengeQuestions}/1?${getLanguage(language)}`, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            // const data =
            //     result.data &&
            //     result?.data?.data[0]?.dataValues[0]?.challenge_questions.length > 0 &&
            //     result?.data?.data[0]?.dataValues[0]?.challenge_questions;
            const data =
                result.data &&
                result?.data?.data[0]?.challenge_questions.length > 0 &&
                result?.data?.data[0]?.challenge_questions;
            
            dispatch(getChallengeQuestionsSuccess(data));
        } else {
            dispatch(
                getStudentListError(result.statusText)
            );
        }
    } catch (error) {
        dispatch(getStudentListError({}));
    }
};
export const getStudentChallengeSubmittedResponseSuccess =
    (questions) => async (dispatch) => {
        dispatch({
            type: GET_CHALLENGE_SUBMITTED_DATA,
            payload: questions
        });
    };
export const getStudentChallengeSubmittedResponse = (id, language) => async (dispatch) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.getChallengeSubmittedResponse}${id}&${getLanguage(language)}`, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data =
                result.data &&
                result?.data?.data.length > 0 &&
                result?.data?.data[0]?.dataValues;
            dispatch(getStudentChallengeSubmittedResponseSuccess(data));
        } else {
            dispatch(
                getStudentListError(result.statusText)
            );
        }
    } catch (error) {
        dispatch(getStudentListError({}));
    }
};

export const initiateIdea = async (id, language,history,data,setShowChallenges) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .post(`${URL.initiateChallenge}${id}&${getLanguage(language)}`,data, axiosConfig)
            .then((user) => user)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            openNotificationWithIcon('success','Idea initiated successfully');
            setShowChallenges(true);
            history.push('/challenges');
        } else {
            openNotificationWithIcon('error','Idea initiation went wrong');
        }
    } catch (error) {
        openNotificationWithIcon('error','Idea initiation went wrong');
    }
};

export const getStudentBadgesSuccess =
    (badges) => async (dispatch) => {
        dispatch({
            type: GET_STUDENT_BADGES,
            payload: badges
        });
    };
export const getStudentBadges = (id, language) => async (dispatch) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.getStudentBadges}${id}/badges?${getLanguage(language)}`, axiosConfig)
            .then((badges) => badges)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data =
                result.data &&
                result?.data?.data;
            dispatch(getStudentBadgesSuccess(data));
        } else {
            dispatch(
                getStudentListError(result.statusText)
            );
        }
    } catch (error) {
        dispatch(getStudentListError({}));
    }
};

export const updateStudentBadges = (data, id, language,t) => async (dispatch) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .post(`${URL.getStudentBadges}${id}/badges?${getLanguage(language)}`, data, axiosConfig)
            .then(() => {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-success',
                    },
                    buttonsStyling: false
                });

                swalWithBootstrapButtons
                    .fire({
                        title: t('badges.congratulations'),
                        text:t('badges.earn'),
                        // text:`You have Earned a New Badge ${data.badge_slugs[0].replace("_"," ").toUpperCase()}`,
                        imageUrl: `${logout}`,
                        showCloseButton: true,
                        confirmButtonText: t('badges.ok'),
                        showCancelButton: false,
                        reverseButtons: false
                    });
            })
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 202) {
            const data =
                result.data &&
                result?.data?.data;
            dispatch(getStudentBadgesSuccess(data));
        } else {
            dispatch(
                getStudentListError(result.statusText)
            );
        }
    } catch (error) {
        dispatch(getStudentListError({}));
    }
};

export const getStudentDashboardStatusSuccess =
    (data) => async (dispatch) => {
        dispatch({
            type: GET_STUDENT_DASHBOARD_STATUS,
            payload: data
        });
    };
export const getStudentDashboardStatus = (id, language) => async (dispatch) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.getStudentDashboardStatusCommonById}${id}?${getLanguage(language)}`, axiosConfig)
            .then((data) => data)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data =
                result.data &&
                result?.data?.data && result?.data?.data[0];
            dispatch(getStudentDashboardStatusSuccess(data));
        } else {
            dispatch(getStudentDashboardStatusSuccess(null));
        }
    } catch (error) {
        dispatch(getStudentDashboardStatusSuccess(null));
    }
};
export const getStudentDashboardChallengesStatusSuccess =
    (data) => async (dispatch) => {
        dispatch({
            type: GET_STUDENT_DASHBOARD_CHALLENGES_STATUS,
            payload: data
        });
    };
export const getStudentDashboardChallengesStatus = (id, language) => async (dispatch) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.getStudentDashboardStatusCommonById}${id}/challenges?${getLanguage(language)}`, axiosConfig)
            .then((data) => data)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data =
                result.data &&
                result?.data?.data && result?.data?.data[0];
            dispatch(getStudentDashboardChallengesStatusSuccess(data));
        } else {
            dispatch(getStudentDashboardChallengesStatusSuccess(null));
        }
    } catch (error) {
        dispatch(getStudentDashboardChallengesStatusSuccess(null));
    }
};
export const getStudentDashboardTeamProgressStatusSuccess =
    (data) => async (dispatch) => {
        dispatch({
            type: GET_STUDENT_DASHBOARD_TEAMPROGRESS,
            payload: data
        });
    };
export const getStudentDashboardTeamProgressStatus = (id, language) => async (dispatch) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${URL.getStudentDashboardStatusCommonById}${id}/teamProgress?${getLanguage(language)}`, axiosConfig)
            .then((data) => data)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data =
                result.data &&
                result?.data?.data && result?.data?.data;
            dispatch(getStudentDashboardTeamProgressStatusSuccess(data));
        } else {
            dispatch(getStudentDashboardTeamProgressStatusSuccess(null));
        }
    } catch (error) {
        dispatch(getStudentDashboardTeamProgressStatusSuccess(null));
    }
};
export const setPresurveyStatus =
    (data) => async (dispatch) => {
        dispatch({
            type: SET_PRESURVEY_STATUS,
            payload: data
        });
    };
export const getStudentDashboardTutorialVideosSuccess =
    (data) => async (dispatch) => {
        dispatch({
            type: GET_STUDENT_DASHBOARD_TUTORIALS,
            payload: data
        });
    };
export const getStudentDashboardTutorialVideos = (language) => async (dispatch) => {
    try {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const result = await axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/tutorialVideos?${getLanguage(language)}`, axiosConfig)
            .then((data) => data)
            .catch((err) => {
                return err.response;
            });
        if (result && result.status === 200) {
            const data =
                result.data &&
                result?.data?.data && result?.data?.data[0].dataValues;
            dispatch(getStudentDashboardTutorialVideosSuccess(data));
        } else {
            dispatch(getStudentDashboardTutorialVideosSuccess(null));
        }
    } catch (error) {
        dispatch(getStudentDashboardTutorialVideosSuccess(null));
    }
};
