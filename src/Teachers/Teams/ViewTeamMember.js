/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Tabs } from 'antd';
// import TicketDataTable from './TicketDataTable';
import Layout from '../Layout';
// import { Link } from 'react-router-dom';
import { BsPlusLg } from 'react-icons/bs';
import { Button } from '../../stories/Button';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
// import dummyCSV from '../../media/basic-csv.csv';
import {
    // getAdminTeamsList,
    getAdminTeamMembersList
} from '../../redux/actions';
import axios from 'axios';
import { openNotificationWithIcon, getCurrentUser } from '../../helpers/Utils';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
import logout from '../../assets/media/logout.svg';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { BreadcrumbTwo } from '../../stories/BreadcrumbTwo/BreadcrumbTwo';
import { useTranslation } from 'react-i18next';

// const { TabPane } = Tabs;

const ViewTeamMember = () => {
    const { t } = useTranslation();
    const currentUser = getCurrentUser('current_user');
    const teamID = JSON.parse(localStorage.getItem('teamId'));

    const history = useHistory();
    const teamId =
        (history &&
            history.location &&
            history.location.item &&
            history.location.item.team_id) ||
        teamID.team_id;

    const headingDetails = {
        title: t('teacher_teams.view_team_member_details'),
        options: [
            {
                title: t('teacher_teams.teamslist'),
                path: '/teacher/teamlist'
            },
            {
                title: t('teacher_teams.view_team_member')
            }
        ]
    };
    const [count, setCount] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [teamMembersListArray, setTeamMembersArray] = useState([]);
    const [teamsMembersList, setTeamsMemers] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [pending, setPending] = React.useState(true);
    const [rows, setRows] = React.useState([]);

    useEffect(() => {
        // props.getAdminTeamMembersListAction(teamId);
        handleteamMembersAPI(teamId);
    }, [teamId, count]);

    async function handleteamMembersAPI(teamId) {
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/teams/' +
                teamId +
                '/members' +
                '?status=ACTIVE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data[0].token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    console.log('response.data.data', response.data.data);
                    setTeamsMemers(response.data && response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // useEffect(() => {
    //     var teamsMembersArrays = [];
    //     props.teamsMembersList.length > 0 &&
    //         props.teamsMembersList.map((teams, index) => {
    //             var key = index + 1;
    //             return teamsMembersArrays.push({ ...teams, key });
    //         });
    //     setTeamMembersArray(teamsMembersArrays);
    // }, [props.teamsMembersList.length > 0, count]);

    useEffect(() => {
        var teamsMembersArrays = [];
        teamsMembersList.length > 0 &&
            teamsMembersList.map((teams, index) => {
                var key = index + 1;
                return teamsMembersArrays.push({ ...teams, key });
            });
        setTeamMembersArray(teamsMembersArrays);
    }, [teamsMembersList.length > 0, count]);

    var adminTeamMembersList = {
        data: teamsMembersList.length > 0 && teamsMembersList,
        columns: [
            {
                name: 'User Name',
                selector: 'user.username',
                width: '15%'
            },
            {
                name: 'Password',
                selector: 'UUID',
                width: '10%'
            },
            {
                name: t('teacher_teams.student_name'),
                selector: 'full_name',
                width: '15%'
            },
            {
                name: t('teacher_teams.grade'),
                selector: 'Grade',
                width: '10%'
            },
            {
                name: t('teacher_teams.age'),
                selector: 'Age',
                width: '9%'
            },

            {
                name: t('teacher_teams.gender'),
                selector: 'Gender',
                width: '12%'
            },
            {
                name: t('teacher_teams.actions'),
                cell: (params) => {
                    return [
                        <a onClick={() => handleEditTeamMember(params)}>
                            <i
                                key={params.team_id}
                                className="fa fa-edit"
                                style={{ marginRight: '10px' }}
                            />
                        </a>,
                        <a onClick={() => handleDeleteTeamMember(params)}>
                            <i
                                key={params.team_id}
                                className="fa fa-trash"
                                style={{ marginRight: '10px' }}
                            />
                        </a>,
                        <a onClick={() => handleReseatTeamMember(params)}>
                            <i key={params.team_id} className="fa fa-key" />
                        </a>
                    ];
                },
                width: '15%',
                center: true
            }
        ]
    };
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(adminTeamMembersList.data);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    const handleEditTeamMember = (item) => {
        history.push({
            pathname: '/teacher/edit-team-member',
            item: item
        });
    };

    const handleReseatTeamMember = (item) => {
        const body = JSON.stringify({
            user_id: JSON.stringify(item.user_id)
        });
        console.log('item', body);

        var config = {
            method: 'put',
            url: process.env.REACT_APP_API_BASE_URL + '/students/resetPassword',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data[0].token}`
            },
            data: body
        };
        axios(config)
            .then(function (response) {
                if (response.status === 202) {
                    setCount(count + 1);
                    openNotificationWithIcon(
                        'success',
                        'Password Successfully Updated'
                    );
                } else {
                    openNotificationWithIcon('error', 'Opps! Something Wrong');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleDeleteTeamMember = (item) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons
            .fire({
                title: t('teacher_teams.delete_member_warning'),
                text: t('teacher_teams.sure'),
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: t('teacher_teams.delete'),
                showCancelButton: true,
                cancelButtonText: t('general_req.btn_cancel'),
                reverseButtons: false
            })
            .then((result) => {
                if (result.isConfirmed) {
                    const body = JSON.stringify({
                        status: 'DELETED'
                    });
                    var config = {
                        method: 'put',
                        url:
                            process.env.REACT_APP_API_BASE_URL +
                            '/students/' +
                            item.student_id,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser.data[0].token}`
                        },
                        data: body
                    };
                    axios(config)
                        .then(function (response) {
                            if (response.status === 200) {
                                setCount(count + 1);
                                openNotificationWithIcon(
                                    'success',
                                    t('teacher_teams.delete_success')
                                );
                            } else {
                                openNotificationWithIcon(
                                    'error',
                                    'Opps! Something Wrong'
                                );
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        t('teacher_teams.delete_cancelled'),
                        t('teacher_teams.delete_member_warning'),
                        'error'
                    );
                }
            });
    };

    return (
        <Layout>
            <Container className="ticket-page mb-50 userlist">
                <Row className="mt-5 pt-5">
                    <Row className="mb-2 mb-sm-5 mb-md-5 mb-lg-0">
                        <Col className="col-auto">
                            <BreadcrumbTwo {...headingDetails} />
                        </Col>

                        <Col className="ticket-btn col ml-auto ">
                            <div className="d-flex justify-content-end">
                                <Button
                                    label={t('teacher_teams.back')}
                                    btnClass="primary ml-2"
                                    size="small"
                                    shape="btn-square"
                                    Icon={BsPlusLg}
                                    onClick={() =>
                                        history.push('/teacher/teamlist')
                                    }
                                />
                            </div>
                        </Col>
                    </Row>

                    <p>
                        {t('teacher_teams.team_name')}: {teamID.team_name}
                    </p>
                    <div className="ticket-data">
                        <Tabs defaultActiveKey="1">
                            <div className="my-2">
                                <DataTableExtensions
                                    print={false}
                                    export={false}
                                    {...adminTeamMembersList}
                                >
                                    <DataTable
                                        data={rows}
                                        defaultSortField="id"
                                        defaultSortAsc={false}
                                        // pagination
                                        highlightOnHover
                                        fixedHeader
                                        subHeaderAlign={Alignment.Center}
                                    />
                                </DataTableExtensions>
                            </div>
                        </Tabs>
                    </div>
                </Row>
            </Container>
        </Layout>
    );
};

const mapStateToProps = ({ teams }) => {
    const { teamsMembersList } = teams;
    return { teamsMembersList };
};

export default connect(mapStateToProps, {
    getAdminTeamMembersListAction: getAdminTeamMembersList
})(ViewTeamMember);
