import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Tabs } from "antd";
import Layout from "../../Admin/Layout";
import { Link } from "react-router-dom";
import {
    BsPlusLg,
    BsUpload,
    BsGraphUp,
} from "react-icons/bs";
import { Button } from "../../stories/Button";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import dummyCSV from "../../assets/media/basic-csv.csv";
import {
    // getEvaluatorsBulkUploadList,
    getAdminMentorsList,
    updateMentorStatus,
} from "../../redux/actions";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import logout from "../../assets/media/logout.svg";
import ImportPopup from "./ImportPopup";
import DataTable, { Alignment } from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { getStudentRegistationData, updateStudentStatus } from "../../redux/studentRegistration/actions";
import { Badge } from "react-bootstrap";

const { TabPane } = Tabs;

const TicketsPage = (props) => {
    const [showImportPopup, setImportPopup] = useState(false);

    const history = useHistory();
    // const [student, activeStudent] = useState(false);
    const [menter, activeMenter] = useState(false);
    const [evaluater, activeEvaluater] = useState(false);
    const [tab, setTab] = useState("1");

    // const [file] = useState();
    // const [fileName, setFileName] = useState("");
    // const currentUser = getCurrentUser("current_user");
    // const [ setSuccessResponse] = useState("");
    // const [ setErrorResponse] = useState("");
    // const [status, setStatus] = useState("");
    // const [studentType, setStudentType] = React.useState("below");
    // const callback = () => {};
    // useEffect(() => {
    //     props.getEvaluatorsBulkUploadListAction("i");
    // }, []);
    useEffect(() => {
        if(Number(tab) === 1){
            props.getStudentListAction("i");
        }else if(tab===2){
            props.getAdminMentorsListAction("ACTIVE");
        }
    }, [tab]);
    

    const [rows, setRows] = React.useState([]);
    const [mentorRows, setMentorRows] = React.useState([]);
    // const [mentorActiveRows, setMentorActiveRows] = React.useState([]);
    // const [mentorInactiveRows, setMentorInactiveRows] = React.useState([]);

    useEffect(() => {
        const mentorTimeout = setTimeout(() => {
            setMentorRows(TableMentorsProps.data);
        }, 2000);
        return () => clearTimeout(mentorTimeout);
    }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(StudentsData.data);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);
    
    const changeTab = (e) => {
        localStorage.setItem("tab",e);
        if (e === "3") {
            activeEvaluater(!evaluater);
            props.getAdminEvalutorsListAction(history);
            activeMenter(false);
        } else if (e === "2") {
            props.getAdminMentorsListAction("ACTIVE");
            activeMenter(!menter);
            activeEvaluater(false);
        } else {
            activeEvaluater(false);
            activeMenter(false);
        }
    };
    useEffect(() => {       
        if(localStorage.getItem("tab")){
            setTab(localStorage.getItem("tab"));
        }
    }, [localStorage.getItem("tab")]);
    
    const handleSelect = (item) => {
        props.history.push({
            pathname: `/admin/userprofile`,
            data: item,
        });
    };
    const handleEdit = (item) => {
        props.history.push({
            pathname: `/admin/edit-user-profile`,
            data: item,
        });
        localStorage.setItem('mentor', JSON.stringify(item));
    };
    const handleDelete = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: "You are attempting to delete Evalauaor.",
                text: "Are you sure?",
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: "Delete",
                showCancelButton: true,
                cancelButtonText: "Cancel",
                reverseButtons: false,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire(
                        "Loged out!",
                        "Successfully deleted.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "You are Logged in",
                        "error"
                    );
                }
            });
    };
    const handleStatus = (status,id,type=undefined) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger",
            },
            buttonsStyling: false,
        });

        swalWithBootstrapButtons
            .fire({
                title: `You are attempting to ${status.toLowerCase() ==="active" ? "activate":"inactivate"} ${type && type ==="student" ? "Student" : "Mentor"}.`,
                text: "Are you sure?",
                imageUrl: `${logout}`,
                showCloseButton: true,
                confirmButtonText: status,
                showCancelButton: true,
                cancelButtonText: "Cancel",
                reverseButtons: false,
            })
            .then((result) => {
                if (result.isConfirmed) {
                    if(type && type ==="student"){
                        props.studentStatusUpdate({status},id);
                        setTimeout(() => {
                            props.getStudentListAction();
                        }, 500);
                    }else{
                        props.mentorStatusUpdate({status},id);
                        setTimeout(() => {
                            props.getAdminMentorsListAction(status);
                        }, 500);
                    }
                    swalWithBootstrapButtons.fire(
                        `${type && type ==="student" ? "Student" : "Mentor"} Status has been changed!`,
                        "Successfully updated.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Not updated successfully",
                        "error"
                    );
                }
            });
    };
    const TableMentorsProps = {
        data: props.mentorsList,
        totalItems:props.totalItems,
        columns: [
            {
                name: "S.No",
                selector: "mentor_id",
                width:"8%"
            },
            {
                name: "UDISE  Code",
                selector: "organization_code",
                width:"10%"
            },
            
            {
                name: "Teacher Name",
                selector: "full_name",
                width:"12%"
            },
            
            {
                name: "Email",
                selector: "username",
                width:"20%"
            },
            {
                name: "Phone",
                selector: "mobile",
                width:"20%"
            },
            {
                name: "Status",
                cell: (row) => [
                    <Badge
                        key={row.mentor_id}
                        bg={`${
                            row.status === 'ACTIVE' ? 'secondary' : 'danger'
                        }`}
                    >
                        {row.status}
                    </Badge>
                ],
                width:"8%"
            },
            {
                name: "ACTIONS",
                selector: "action",
                width:"20%",
                cell: (record) => [
                    <Link
                        exact='true'
                        key={record.id}
                        onClick={() => handleSelect(record)}
                        style={{marginRight:"10px"}}
                    >
                        <div className="btn btn-primary btn-lg">View</div>
                    </Link>,
                    <Link
                        exact='true'
                        key={record.id}
                        onClick={() => handleEdit(record)}
                        style={{marginRight:"10px"}}
                    >
                        <div className="btn btn-warning btn-lg">Edit</div>
                    </Link>,
                    <Link 
                        exact='true' 
                        key={record.id}
                        className='mr-5' 
                        onClick={() => {
                            let status = record?.status === "ACTIVE" ? "INACTIVE":"ACTIVE";
                            handleStatus(status,record?.mentor_id);
                        }}>
                        {record?.status === "ACTIVE" ?<div className="btn btn-danger btn-lg">Inactive</div> : <div className="btn btn-secondary btn-lg">Active</div>}
                    </Link>
                ],
            },
        ],
    };
    const StudentsData = {
        data: props.studentList,
        columns: [
            {
                name: "S.No.",
                selector: "student_id",
                width: "10%",
                // center: true,
            },
            {
                name: "Team Code",
                selector: "team_id",
                // sortable: true,
                width: "20%",
                // center: true,
            },
            {
                name: "Student Name",
                selector: "full_name",
                width: "21%",
                // center: true,
            },
            {
                name: "Institute",
                selector: "institute_name",
                width: "20%",
                // center: right,
            },
            {
                name: "Qualification",
                selector: "qualification",
                width: "15%",
                // center: right,
            },
            {
                name: "Action",
                sortable: false,
                selector: "null",
                width: "14%",
                cell: (record) => [
                    <Link
                        key={record.id}
                        exact='true'
                        onClick={() => handleSelect(record)}
                        style={{marginRight:"10px"}}
                    >
                        <div className="btn btn-primary btn-lg mr-5">View</div>
                    </Link>,
                    <Link
                        key={record.id}
                        exact='true'
                        onClick={() => {
                            let status = record?.status === "ACTIVE" ? "INACTIVE":"ACTIVE";
                            handleStatus(status,record?.student_id,"student");
                        }}
                    >
                        {record?.status === "ACTIVE" ?<div className="btn btn-danger btn-lg">Inactive</div> : <div className="btn btn-secondary btn-lg">Active</div>}
                    </Link>
                ]
            }
        ],
    };
    return (
        <Layout>
            <Container className='ticket-page mb-50 userlist'>
                <Row className='mt-0 pt-3'>
                    <h2 onClick={handleDelete}>User List</h2>
                    <div className='ticket-data'>
                        <Tabs defaultActiveKey={localStorage.getItem("tab")} onChange={(key) => changeTab(key)}>
                            <Row className='mt-0'>                                
                                <Col className='ticket-btn col ml-auto  '>
                                    <div className='d-flex justify-content-end'>
                                        <Button
                                            label='Import'
                                            btnClass='primary-outlined'
                                            size='small'
                                            shape='btn-square'
                                            Icon={BsUpload}
                                            onClick={() => setImportPopup(true)}
                                        />

                                        <a
                                            href={dummyCSV}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='primary'
                                        >
                                            <Button
                                                label='Export'
                                                btnClass='primary-outlined mx-2'
                                                size='small'
                                                shape='btn-square'
                                                Icon={BsGraphUp}
                                                style={{ color: "#231f20" }}
                                            />
                                        </a>

                                        {menter === true ? (
                                            <Button
                                                label='Add Mentor'
                                                btnClass='primary ml-2'
                                                size='small'
                                                shape='btn-square'
                                                Icon={BsPlusLg}
                                                onClick={() => props.history.push("/admin/add-mentor")}
                                            />
                                        ) : evaluater === true ? (
                                            <Button
                                                label='Add Evaluator'
                                                btnClass='primary ml-2'
                                                size='small'
                                                shape='btn-square'
                                                Icon={BsPlusLg}
                                                onClick={() =>
                                                    props.history.push("/admin/add-evaluator")
                                                }
                                            />
                                        ) : null}
                                    </div>
                                </Col>
                            </Row>
                            <TabPane
                                tab='Students'
                                key='1'
                                className='bg-white p-3 mt-2 sub-tab'
                                tabId="1"
                            >
                                <div className='my-5'>
                                    <DataTableExtensions {...StudentsData} exportHeaders>
                                        <DataTable
                                            data={rows}
                                            defaultSortField='id'
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </TabPane>
                            <TabPane
                                tab='Teachers'
                                key='2'
                                className='bg-white p-3 mt-2 sub-tab'
                                tabId="2"
                            >
                                <div className='my-5'>
                                    <DataTableExtensions {...TableMentorsProps} exportHeaders>
                                        <DataTable
                                            data={mentorRows}
                                            defaultSortField='id'
                                            defaultSortAsc={false}
                                            pagination
                                            highlightOnHover
                                            fixedHeader
                                            subHeaderAlign={Alignment.Center}
                                        />
                                    </DataTableExtensions>
                                </div>
                               
                            </TabPane>
                            <TabPane
                                tab='Evaluators'
                                key='3'
                                className='bg-white p-3 mt-2 sub-tab'
                                tabId="3"
                            >
                                <h2 className='py-5 w-100 text-center'>
                                    PAGE UNDER CONSTRUCTION
                                </h2>
                            </TabPane>
                            <TabPane
                                tab='Admins'
                                key='4'
                                className='bg-white p-3 mt-2 sub-tab'
                                tabId="4"
                                
                            >
                                <h2 className='py-5 w-100 text-center'>
                                    PAGE UNDER CONSTRUCTION
                                </h2>
                            </TabPane>
                        </Tabs>
                    </div>
                </Row>
            </Container>
            <ImportPopup
                show={showImportPopup}
                setImportPopup={setImportPopup}
                onHide={() => setImportPopup(false)}
            />
        </Layout>
    );
};

const mapStateToProps = ({ evaluatorsBulkUpload, adminMentors,studentRegistration }) => {
    const { evaluatorsBulkUploadList } = evaluatorsBulkUpload;
    const { mentorsList,totalItems } = adminMentors;
    const { studentList } = studentRegistration;
    return { evaluatorsBulkUploadList, mentorsList,totalItems,studentList };
};
export default connect(mapStateToProps, {
    // getEvaluatorsBulkUploadListAction: getEvaluatorsBulkUploadList,
    getAdminMentorsListAction: getAdminMentorsList,
    getStudentListAction: getStudentRegistationData,
    mentorStatusUpdate: updateMentorStatus,
    studentStatusUpdate: updateStudentStatus,
})(TicketsPage);
// export default TicketsPage;
