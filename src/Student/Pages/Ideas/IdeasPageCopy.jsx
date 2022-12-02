/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Form,
    FormGroup,
    Input,
    Label
} from 'reactstrap';
import { Button } from '../../../stories/Button';
import { TextArea } from '../../../stories/TextArea/TextArea';

import Layout from '../../Layout';
import { useSelector } from 'react-redux';
import {
    getStudentChallengeQuestions,
    getStudentChallengeSubmittedResponse
} from '../../../redux/studentRegistration/actions';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../../helpers/Utils';
import {
    getNormalHeaders,
    openNotificationWithIcon
} from '../../../helpers/Utils';
import axios from 'axios';
import { KEY, URL } from '../../../constants/defaultValues';
import CommonPage from '../../../components/CommonPage';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../../assets/media/logout.svg';
import { cardData } from './SDGData';

const IdeasPageNew = () => {
    const { t } = useTranslation();
    const { challengeQuestions } = useSelector(
        (state) => state?.studentRegistration
    );
    const showPage = false;
    const [answerResponses, setAnswerResponses] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const { challengesSubmittedResponse } = useSelector(
        (state) => state?.studentRegistration
    );
    const initialSDG = challengesSubmittedResponse[0]?.sdg;
    const [sdg, setSdg] = useState(challengesSubmittedResponse[0]?.sdg);
    const [others, setOthers] = useState(
        challengesSubmittedResponse[0]?.others
    );

    const initiatedBy =
        challengesSubmittedResponse &&
        challengesSubmittedResponse.length > 0 &&
        challengesSubmittedResponse[0].initiated_by;
    const submittedResponse = challengesSubmittedResponse[0]?.response;
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const currentUser = getCurrentUser('current_user');

    const dispatch = useDispatch();

    const prePopulatingData = (answers) => {
        if (answers && answers !== {}) {
            const data = Object.entries(answers);
            const answerFormat = data.map((item) => {
                return {
                    challenge_question_id: item[0],
                    selected_option: item[1]?.selected_option
                };
            });
            return answerFormat;
        }
    };
    const filterAnswer = (questionId) => {
        const data =
            answerResponses &&
            answerResponses.length > 0 &&
            answerResponses.filter(
                (item) => item.challenge_question_id == questionId
            );
        return data && data.length > 0 && data[0].selected_option
            ? data[0].selected_option
            : '';
    };
    useEffect(() => {
        dispatch(getStudentChallengeQuestions(language));
    }, [language, dispatch]);
    useEffect(() => {
        setAnswerResponses(
            prePopulatingData(submittedResponse)
                ? prePopulatingData(submittedResponse)
                : []
        );
    }, []);
    useEffect(() => {
        setSdg(challengesSubmittedResponse[0]?.sdg);
        setOthers(challengesSubmittedResponse[0]?.others);
    }, [challengesSubmittedResponse]);

    useEffect(() => {
        dispatch(
            getStudentChallengeSubmittedResponse(
                currentUser?.data[0]?.team_id,
                language
            )
        );
    }, [language, dispatch, currentUser?.data[0]?.team_id]);

    const handleChange = (e) => {
        let newItems = [...answerResponses];
        let obj = {
            challenge_question_id: e.target.name,
            selected_option:
                e.target.type === 'checkbox' ? [e.target.value] : e.target.value
        };
        const findExistanceIndex = newItems.findIndex(
            (item) =>
                parseInt(item?.challenge_question_id) ===
                parseInt(e.target.name)
        );
        if (findExistanceIndex === -1) {
            newItems.push(obj);
        } else {
            let temp = newItems[findExistanceIndex];
            if (e.target.type === 'checkbox') {
                let options = [...temp.selected_option];
                let indexOfCheckedAnswers = options.indexOf(e.target.value);
                if (e.target.checked && indexOfCheckedAnswers === -1) {
                    options.push(e.target.value);
                } else {
                    options.splice(indexOfCheckedAnswers, 1);
                }
                newItems[findExistanceIndex] = {
                    ...temp,
                    selected_option: options
                };
            } else {
                newItems[findExistanceIndex] = {
                    ...temp,
                    selected_option: e.target.value
                };
            }
        }
        setAnswerResponses(newItems);
    };
    const swalWrapper = (e, type) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
            allowOutsideClick: false
        });

        swalWithBootstrapButtons
            .fire({
                title: t('general_req.submit_idea'),
                text: t('general_req.are_you_sure'),
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: t('teacher_teams.submit'),
                showCancelButton: true,
                cancelButtonText: t('general_req.btn_cancel'),
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    if (result.isConfirmed) {
                        handleSubmit(e, type);
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(t('general_req.cancelled'));
                }
            });
    };
    const handleSubmit = async (e, type) => {
        e.preventDefault();
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        let responses = answerResponses.map((eachValues) => {
            return {
                challenge_question_id: eachValues.challenge_question_id,
                selected_option: eachValues.selected_option
            };
        });
        let submitData = {
            responses,
            status: type ? 'DRAFT' : 'SUBMITTED',
            sdg,
            others: others ? others : ''
        };
        await axios
            .post(
                `${URL.submitChallengeResponse}?team_id=${currentUser?.data[0]?.team_id}`,
                submitData,
                axiosConfig
            )
            .then((challengeStatus) => {
                if (challengeStatus?.status == 200) {
                    openNotificationWithIcon(
                        'success',
                        `Idea has been submitted ${
                            type ? 'as draft' : 'successfully'
                        } `
                    );
                    setTimeout(() => {
                        dispatch(
                            getStudentChallengeSubmittedResponse(
                                currentUser?.data[0]?.team_id,
                                language
                            )
                        );
                        setIsDisabled(true);
                    }, 500);
                }
            })
            .catch((err) => {
                return err.response;
            });
    };

    useEffect(() => {
        if (submittedResponse && submittedResponse !== {}) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, []);
    const scroll = () => {
        const section = document.querySelector('#start');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const handleEdit = () => {
        setIsDisabled(false);
        scroll();
    };
    const comingSoonText = t('dummytext.student_idea_sub');
    return (
        <Layout>
            {showPage ? (
                <CommonPage text={comingSoonText} />
            ) : (
                <Container className="presuervey mb-50 mt-5 " id="start">
                    <Col>
                        <Row className=" justify-content-center">
                            <Card className="aside  mb-5 p-4">
                                <CardBody>
                                    {challengeQuestions.length > 0 && (
                                        <Form
                                            className="form-row row mb-5 mt-3 py-5"
                                            isSubmitting
                                        >
                                            <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                <div className="question quiz mb-0">
                                                    <b
                                                        style={{
                                                            fontSize: '1.6rem'
                                                        }}
                                                    >
                                                        {1}. Which Sustainable
                                                        development Goal (SDG)
                                                        are you targeting with
                                                        your solution ?
                                                    </b>
                                                </div>
                                                <div>
                                                    <p
                                                        className="text-muted ms-5"
                                                        style={{
                                                            fontSize: '1.4rem'
                                                        }}
                                                    >
                                                        (You can refer to the
                                                        SDGs sheet from FIND
                                                        Module and pick the
                                                        right option )
                                                    </p>
                                                </div>
                                                <div className=" answers row flex-column p-4">
                                                    <select
                                                        disabled={isDisabled}
                                                        onChange={(e) =>
                                                            setSdg(
                                                                e.target.value
                                                            )
                                                        }
                                                        name="teams"
                                                        id="teams"
                                                    >
                                                        {cardData.map(
                                                            (item, i) => (
                                                                <option
                                                                    key={i}
                                                                    value={
                                                                        item.goal_title
                                                                    }
                                                                    selected={
                                                                        item.goal_title ===
                                                                        sdg
                                                                    }
                                                                >
                                                                    {
                                                                        item.goal_title
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            </Row>
                                            {sdg === 'OTHERS' && (
                                                <Row className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                    <div className="question quiz mb-0">
                                                        <b
                                                            style={{
                                                                fontSize:
                                                                    '1.6rem'
                                                            }}
                                                        >
                                                            {2}. If you picked
                                                            the option ‘others’
                                                            in the above
                                                            question, write down
                                                            which SDG or theme
                                                            is your solution
                                                            targeting.
                                                        </b>
                                                    </div>
                                                    <FormGroup
                                                        check
                                                        className="answers"
                                                    >
                                                        <Label
                                                            check
                                                            style={{
                                                                width: '100%'
                                                            }}
                                                        >
                                                            <TextArea
                                                                disabled={
                                                                    isDisabled
                                                                }
                                                                value={others}
                                                                onChange={(e) =>
                                                                    setOthers(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Label>
                                                    </FormGroup>
                                                </Row>
                                            )}
                                            {challengeQuestions.map(
                                                (eachQuestion, i) => (
                                                    <>
                                                        <Row key={i} className="card mb-4 my-3 comment-card px-0 px-5 py-3 card">
                                                            <div className="question quiz mb-0">
                                                                <b
                                                                    style={{
                                                                        fontSize:
                                                                            '1.6rem'
                                                                    }}
                                                                >
                                                                    {i +
                                                                        (sdg ===
                                                                        'OTHERS'
                                                                            ? 3
                                                                            : 2)}
                                                                    .{' '}
                                                                    {
                                                                        eachQuestion.question
                                                                    }
                                                                </b>
                                                            </div>
                                                            <div>
                                                                {eachQuestion?.description && (
                                                                    <p
                                                                        className="text-muted ms-5"
                                                                        style={{
                                                                            fontSize:
                                                                                '1.4rem'
                                                                        }}
                                                                    >
                                                                        {
                                                                            eachQuestion.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="answers">
                                                                <FormGroup
                                                                    tag="fieldset"
                                                                    className="w-100 challenges-fs"
                                                                    id="radioGroup1"
                                                                    label="One of these please"
                                                                >
                                                                    <>
                                                                        {eachQuestion.type ===
                                                                            'TEXT' && (
                                                                            <FormGroup
                                                                                check
                                                                                className=" answers"
                                                                            >
                                                                                <Label
                                                                                    check
                                                                                    style={{
                                                                                        width: '100%'
                                                                                    }}
                                                                                >
                                                                                    <TextArea
                                                                                        name={`${eachQuestion.challenge_question_id}`}
                                                                                        disabled={
                                                                                            isDisabled
                                                                                        }
                                                                                        value={filterAnswer(
                                                                                            eachQuestion.challenge_question_id
                                                                                        )}
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleChange(
                                                                                                e
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </Label>
                                                                            </FormGroup>
                                                                        )}
                                                                        {eachQuestion.type ===
                                                                            'DRAW' && (
                                                                            <FormGroup
                                                                                check
                                                                                className="mx-5 answers"
                                                                            >
                                                                                <Label
                                                                                    check
                                                                                >
                                                                                    <Input
                                                                                        type="file"
                                                                                        disabled={
                                                                                            isDisabled
                                                                                        }
                                                                                        name={`${eachQuestion.challenge_question_id}`}
                                                                                        // value={`${eachQuestion.challenge_question_id} -- ${""}`}
                                                                                    />
                                                                                </Label>
                                                                            </FormGroup>
                                                                        )}
                                                                        {eachQuestion.type ===
                                                                            'MRQ' && (
                                                                            <>
                                                                                <FormGroup
                                                                                    check
                                                                                    className="mx-5"
                                                                                >
                                                                                    <Label
                                                                                        check
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '1.4rem'
                                                                                        }}
                                                                                    >
                                                                                        <Input
                                                                                            type="radio"
                                                                                            name={`${eachQuestion.challenge_question_id}`}
                                                                                            id="radioOption1"
                                                                                            disabled={
                                                                                                isDisabled
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleChange(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                            value={`${eachQuestion.option_a}`}
                                                                                        />
                                                                                        {
                                                                                            eachQuestion.option_a
                                                                                        }
                                                                                    </Label>
                                                                                </FormGroup>
                                                                                <FormGroup
                                                                                    check
                                                                                    className="mx-5"
                                                                                >
                                                                                    <Label
                                                                                        check
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '1.4rem'
                                                                                        }}
                                                                                    >
                                                                                        <Input
                                                                                            type="radio"
                                                                                            name={`${eachQuestion.challenge_question_id}`}
                                                                                            id="radioOption2"
                                                                                            disabled={
                                                                                                isDisabled
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleChange(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                            value={`${eachQuestion.option_b}`}
                                                                                        />{' '}
                                                                                        {
                                                                                            eachQuestion.option_b
                                                                                        }
                                                                                    </Label>
                                                                                </FormGroup>
                                                                                <FormGroup
                                                                                    check
                                                                                    className="mx-5"
                                                                                >
                                                                                    <Label
                                                                                        check
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '1.4rem'
                                                                                        }}
                                                                                    >
                                                                                        <Input
                                                                                            type="radio"
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleChange(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                            name={`${eachQuestion.challenge_question_id}`}
                                                                                            id="radioOption3"
                                                                                            disabled={
                                                                                                isDisabled
                                                                                            }
                                                                                            value={`${eachQuestion.option_c}`}
                                                                                        />{' '}
                                                                                        {
                                                                                            eachQuestion.option_c
                                                                                        }
                                                                                    </Label>
                                                                                </FormGroup>

                                                                                <FormGroup
                                                                                    check
                                                                                    className="mx-5"
                                                                                >
                                                                                    <Label
                                                                                        check
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '1.4rem'
                                                                                        }}
                                                                                    >
                                                                                        <Input
                                                                                            type="radio"
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleChange(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                            name={`${eachQuestion.challenge_question_id}`}
                                                                                            disabled={
                                                                                                isDisabled
                                                                                            }
                                                                                            id="radioOption4"
                                                                                            value={`${eachQuestion.option_d}`}
                                                                                        />{' '}
                                                                                        {
                                                                                            eachQuestion.option_d
                                                                                        }
                                                                                    </Label>
                                                                                </FormGroup>
                                                                            </>
                                                                        )}
                                                                        {eachQuestion.type ===
                                                                            'MCQ' && (
                                                                            <>
                                                                                <FormGroup
                                                                                    check
                                                                                    className="mx-5"
                                                                                >
                                                                                    <Label
                                                                                        check
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '1.4rem'
                                                                                        }}
                                                                                    >
                                                                                        <Input
                                                                                            type="checkbox"
                                                                                            name={`${eachQuestion.challenge_question_id}`}
                                                                                            disabled={
                                                                                                isDisabled
                                                                                            }
                                                                                            checked={
                                                                                                filterAnswer(
                                                                                                    eachQuestion.challenge_question_id
                                                                                                ) &&
                                                                                                filterAnswer(
                                                                                                    eachQuestion.challenge_question_id
                                                                                                ).includes(
                                                                                                    eachQuestion.option_a
                                                                                                )
                                                                                            }
                                                                                            id={
                                                                                                eachQuestion.option_a
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleChange(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                            value={`${eachQuestion.option_a}`}
                                                                                        />
                                                                                        {
                                                                                            eachQuestion.option_a
                                                                                        }
                                                                                    </Label>
                                                                                </FormGroup>
                                                                                <FormGroup
                                                                                    check
                                                                                    className="mx-5"
                                                                                >
                                                                                    <Label
                                                                                        check
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '1.4rem'
                                                                                        }}
                                                                                    >
                                                                                        <Input
                                                                                            type="checkbox"
                                                                                            name={`${eachQuestion.challenge_question_id}`}
                                                                                            disabled={
                                                                                                isDisabled
                                                                                            }
                                                                                            checked={
                                                                                                filterAnswer(
                                                                                                    eachQuestion.challenge_question_id
                                                                                                ) &&
                                                                                                filterAnswer(
                                                                                                    eachQuestion.challenge_question_id
                                                                                                ).includes(
                                                                                                    eachQuestion.option_b
                                                                                                )
                                                                                            }
                                                                                            id={
                                                                                                eachQuestion.option_b
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleChange(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                            value={`${eachQuestion.option_b}`}
                                                                                        />
                                                                                        {
                                                                                            eachQuestion.option_b
                                                                                        }
                                                                                    </Label>
                                                                                </FormGroup>
                                                                                <FormGroup
                                                                                    check
                                                                                    className="mx-5"
                                                                                >
                                                                                    <Label
                                                                                        check
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '1.4rem'
                                                                                        }}
                                                                                    >
                                                                                        <Input
                                                                                            type="checkbox"
                                                                                            disabled={
                                                                                                isDisabled
                                                                                            }
                                                                                            name={`${eachQuestion.challenge_question_id}`}
                                                                                            checked={
                                                                                                filterAnswer(
                                                                                                    eachQuestion.challenge_question_id
                                                                                                ) &&
                                                                                                filterAnswer(
                                                                                                    eachQuestion.challenge_question_id
                                                                                                ).includes(
                                                                                                    eachQuestion.option_c
                                                                                                )
                                                                                            }
                                                                                            id={
                                                                                                eachQuestion.option_c
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleChange(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                            value={`${eachQuestion.option_c}`}
                                                                                        />
                                                                                        {
                                                                                            eachQuestion.option_c
                                                                                        }
                                                                                    </Label>
                                                                                </FormGroup>

                                                                                <FormGroup
                                                                                    check
                                                                                    className="mx-5"
                                                                                >
                                                                                    <Label
                                                                                        check
                                                                                        style={{
                                                                                            fontSize:
                                                                                                '1.4rem'
                                                                                        }}
                                                                                    >
                                                                                        <Input
                                                                                            type="checkbox"
                                                                                            name={`${eachQuestion.challenge_question_id}`}
                                                                                            disabled={
                                                                                                isDisabled
                                                                                            }
                                                                                            checked={
                                                                                                filterAnswer(
                                                                                                    eachQuestion.challenge_question_id
                                                                                                ) &&
                                                                                                filterAnswer(
                                                                                                    eachQuestion.challenge_question_id
                                                                                                ).includes(
                                                                                                    eachQuestion.option_d
                                                                                                )
                                                                                            }
                                                                                            id={
                                                                                                eachQuestion.option_d
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleChange(
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                            value={`${eachQuestion.option_d}`}
                                                                                        />
                                                                                        {
                                                                                            eachQuestion.option_d
                                                                                        }
                                                                                    </Label>
                                                                                </FormGroup>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                </FormGroup>
                                                            </div>
                                                        </Row>
                                                    </>
                                                )
                                            )}

                                            {initiatedBy &&
                                                initiatedBy ===
                                                    currentUser?.data[0]
                                                        ?.user_id &&
                                                challengesSubmittedResponse[0]
                                                    ?.status === 'DRAFT' && (
                                                    <div className="text-right">
                                                        {isDisabled ? (
                                                            <>
                                                                <Button
                                                                    type="button"
                                                                    btnClass="secondary me-3"
                                                                    onClick={
                                                                        handleEdit
                                                                    }
                                                                    size="small"
                                                                    label="Edit Idea Submission"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    btnClass="primary"
                                                                    disabled={
                                                                        answerResponses &&
                                                                        answerResponses.length ===
                                                                            0
                                                                    }
                                                                    onClick={
                                                                        swalWrapper
                                                                    }
                                                                    size="small"
                                                                    label="Submit"
                                                                />
                                                            </>
                                                        ) : (
                                                            <div className="d-flex justify-content-between">
                                                                <Button
                                                                    type="button"
                                                                    btnClass="warning me-3"
                                                                    onClick={() => {
                                                                        setIsDisabled(
                                                                            true
                                                                        );
                                                                        setSdg(
                                                                            initialSDG
                                                                        );
                                                                    }}
                                                                    size="small"
                                                                    label="Discard"
                                                                />
                                                                <div>
                                                                    <Button
                                                                        type="button"
                                                                        btnClass="secondary me-3"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleSubmit(
                                                                                e,
                                                                                'DRAFT'
                                                                            )
                                                                        }
                                                                        size="small"
                                                                        label="Save as Draft"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        btnClass="primary"
                                                                        disabled={
                                                                            answerResponses &&
                                                                            answerResponses.length ===
                                                                                0
                                                                        }
                                                                        onClick={
                                                                            swalWrapper
                                                                        }
                                                                        size="small"
                                                                        label="Submit"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                        </Form>
                                    )}
                                </CardBody>
                            </Card>
                        </Row>
                    </Col>
                </Container>
            )}
        </Layout>
    );
};

export default IdeasPageNew;
