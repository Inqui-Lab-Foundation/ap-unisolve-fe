import React, { useEffect } from 'react';
import { Container, Row } from 'reactstrap';
import { Tabs } from 'antd';
// import TicketDataTable from './TicketDataTable';
import Layout from '../../Admin/Layout';
// import { Link, withRouter } from 'react-router-dom';
// import { BiEditAlt } from 'react-icons/bi';
// import { AiFillDelete } from 'react-icons/ai';
// import { BsChevronRight, BsFilter, BsPlusLg } from 'react-icons/bs';
// import { BreadcrumbComp } from '../../stories/Breadcrumb/BreadcrumbComp';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

import { useState } from 'react';

import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
const { TabPane } = Tabs;
// const { supportTickets } = useSelector((state) => state.mentors);
// const language = useSelector((state) => state?.mentors.mentorLanguage);

const TicketsPage = () => {
    const currentUser = getCurrentUser('current_user');
    const [allTicketResponse, setAllTicketResponse] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [pending, setPending] = React.useState(true);
    const [rows, setRows] = React.useState([]);

    useEffect(() => {
        listApi();
    }, []);

    async function listApi() {
        var config = {
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/supportTickets',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                // console.log(response);
                if (response.status === 200) {
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function openListApi() {
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/supportTickets?status=OPEN',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function inProgressApi() {
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/supportTickets?status=INPROGRESS',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    async function resolvedApi() {
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                '/supportTickets?status=RESOLVED',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    setAllTicketResponse(
                        response.data.data[0] &&
                            response.data.data[0].dataValues
                    );
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const allData = {
        data: allTicketResponse,
        columns: [
            {
                name: 'No.',
                selector: (row, key) => key + 1,
                // selector: 'id',
                width: '8%'
                // center: true,
            },
            {
                name: 'Category',
                selector: (row) => row.query_category,
                sortable: true,
                width: '25%'
                // center: true,
                // cell: (support_ticket_id) => [
                //     <Link
                //         key={support_ticket_id}
                //         to={`/admin/support-journey/ans-ticket?id=${support_ticket_id}`}
                //     >
                //         {support_ticket_id.query_category} <FaComments />{' '}
                //         {support_ticket_id.replies_count}{' '}
                //     </Link>
                // ]
            },

            {
                name: ' Query Details',
                selector: (row) => row.query_details,
                width: '30%',
                // center: true,
                cell: (params) => [
                    <Link
                        key={params.support_ticket_id}
                        to={`/admin/support-journey/ans-ticket?id=${params.support_ticket_id}`}
                    >
                        {params?.query_details} <FaComments />{' '}
                        {params.replies_count}{' '}
                    </Link>
                ]
            },
            // {
            //     name: ' Replies Count',
            //     selector: (row) => row.replies_count,
            //     width: '30%'
            //     // center: true,
            // },
            {
                name: 'Status',
                selector: (row) => row.status,
                width: '15%'
            }
        ]
    };

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(allData.data);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    const changeTab = (e) => {
        if (e === '1') {
            listApi();
        } else if (e === '2') {
            openListApi();
        } else if (e === '3') {
            inProgressApi();
        } else {
            resolvedApi();
        }
    };

    return (
        <Layout>
            {/* <PageConstruction /> */}
            <Container className="ticket-page mb-50">
                <Row className="mt-5 pt-5">
                    <h2>Support</h2>
                    <div className="ticket-data">
                        <Tabs
                            defaultActiveKey="1"
                            onChange={(key) => changeTab(key)}
                        >
                            <TabPane tab="All Tickets" key="1">
                                <div className="my-2">
                                    <DataTableExtensions
                                        print={false}
                                        export={false}
                                        {...allData}
                                        exportHeaders
                                    >
                                        <DataTable
                                            data={rows}
                                            // noHeader
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </TabPane>
                            <TabPane tab="Open" key="2">
                                <div className="my-2">
                                    <DataTableExtensions
                                        print={false}
                                        export={false}
                                        {...allData}
                                        exportHeaders
                                    >
                                        <DataTable
                                            data={rows}
                                            // noHeader
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </TabPane>
                            <TabPane tab="Inprogress" key="3">
                                <div className="my-2">
                                    <DataTableExtensions
                                        print={false}
                                        export={false}
                                        {...allData}
                                        exportHeaders
                                    >
                                        <DataTable
                                            data={rows}
                                            // noHeader
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </TabPane>
                            <TabPane tab="Resolved" key="4">
                                <div className="my-2">
                                    <DataTableExtensions
                                        print={false}
                                        export={false}
                                        {...allData}
                                        exportHeaders
                                    >
                                        <DataTable
                                            data={rows}
                                            // noHeader
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </Row>
            </Container>
        </Layout>
    );
};

export default TicketsPage;
