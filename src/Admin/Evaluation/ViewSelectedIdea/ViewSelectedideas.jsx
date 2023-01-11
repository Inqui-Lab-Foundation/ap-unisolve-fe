/* eslint-disable indent */
import React, { useEffect } from 'react';
import './ViewSelectedideas.scss';
import Layout from '../../../Admin/Layout';
import DataTable, { Alignment } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import moment from 'moment';
import ViewDetail from './ViewDetail';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { KEY, URL } from '../../../constants/defaultValues';
import { Button } from '../../../stories/Button';
import Select from '../Pages/Select';
import { Col, Container, Row} from 'reactstrap';
import { cardData } from '../../../Student/Pages/Ideas/SDGData.js';
import { useSelector } from 'react-redux';
import { getDistrictData } from '../../../redux/studentRegistration/actions';
import { useDispatch } from 'react-redux';
import { ReasonsOptions } from '../../../Evaluator/Admin/Pages/ReasonForRejectionData';
import { getNormalHeaders } from '../../../helpers/Utils';
import { getAdminEvalutorsList } from '../../store/adminEvalutors/actions';
import { getAdminList } from '../../store/admin/actions';
import { Spinner } from 'react-bootstrap';

const ViewSelectedIdea = () => {
    const { search } = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const title = new URLSearchParams(search).get('title');
    const level = new URLSearchParams(search).get('level');
    const evaluation_status = new URLSearchParams(search).get(
        'evaluation_status'
    );
    const [isDetail, setIsDetail] = React.useState(false);
    const [ideaDetails, setIdeaDetails] = React.useState({});
    const [tableData, settableData] = React.useState({});
    const [reason, setReason] = React.useState('');
    const [district, setdistrict] = React.useState('');
    const [sdg, setsdg] = React.useState('');
    const [evalname,setevalname] = React.useState('');
    const [currentRow, setCurrentRow]= React.useState(1);
    const [tablePage, setTablePage]=React.useState(1);
    const [showspin,setshowspin]=React.useState(false);

    const SDGDate = cardData.map((i) => {
        return i.goal_title;
    });
    SDGDate.unshift('ALL SDGs');
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );

    const evallist = useSelector(
        (state) => state?.adminEvalutors?.evalutorsList
    );
    const adminlist = useSelector(
        (state) => state?.admin?.adminList
    );    
    const Allevalobj={};

    const Allevalnamelist = evallist.map((i) => {
        Allevalobj[i.user.full_name] = i.user.user_id;
        return i.user.full_name;
    });
    adminlist?.map((i) =>{
        Allevalobj[i.user.full_name] = i.user.user_id; 
        Allevalnamelist.push(i.user.full_name);
    });
    
    const dataParam = level==='L1' ? '&evaluation_status=' + evaluation_status : title==='L2 YET TO PROCESSED' ? '&yetToProcessList=true': '';
    const filterParams =
        (district && district !== 'All Districts' ? '&district=' + district : '') +
        (sdg && sdg !== 'ALL SDGs' ? '&sdg=' + sdg : '') +
        (reason && '&rejected_reason=' + reason) + (evalname && '&evaluator_id=' + Allevalobj[evalname]);
    const filterParamsfinal = (district && district !== 'All Districts' ? '?district=' + district : '') +
        (sdg && sdg !== 'ALL SDGs' ? '&sdg=' + sdg : '');
    useEffect(() => {
        dispatch(getDistrictData());
        dispatch(getAdminEvalutorsList());
        dispatch(getAdminList());
    }, []);

    // useEffect(() => {
    //     handleideaList();
    // }, [reason, district, sdg]);

    const handleclickcall = () => {
        setshowspin(true);
        handleideaList();
    };

    async function handleideaList() {
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        await axios
            .get(title === 'FINAl'? `${URL.getidealistfinal}${filterParamsfinal}` :`${URL.getidealist}level=${level}${dataParam}${filterParams}`, axiosConfig)
            .then(function (response) {
                if (response.status === 200) {
                    const updatedWithKey = response.data && response.data.data[0] && response.data.data[0].dataValues.map((item, i) => {
                        const upd = { ...item }; upd["key"] = i + 1;
                         return upd;
                     });
                     settableData(updatedWithKey && updatedWithKey);
                     setshowspin(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setshowspin(false);
            });
    }
    const average = arr => arr.reduce((p,c) => p+c,0)/arr.length;
    const evaluatedIdea = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                selector: (row) => row.key,
                sortable: true,
                width: '7%'
            },
            {
                name: 'Team Name',
                selector: (row) => row.team_name || '',
                sortable: true,
                width: '15%'
            },
            {
                name: 'SDG',
                selector: (row) => row.sdg,
                width: '15%'
            },
            {
                name: 'Submitted By',
                selector: (row) => row.initiated_name,
                width: '15%'
            },
            {
                name: 'Evaluated By',
                cell: (row) => {
                    return [row.evaluated_name ? row.evaluated_name : ''];
                },
                width: '15%'
            },
            {
                name: 'Evaluated At',
                selector: (row) =>
                    row.evaluated_at
                        ? moment(row.evaluated_at).format('DD-MM-YY h:mm:ss a')
                        : row.evaluated_at,
                width: '15%'
            },
            
            {
                name: 'Status',
                // selector: (row) => row.evaluation_status && row.evaluation_status=='SELECTEDROUND1'?'Accepted':row.evaluation_status=='REJECTEDROUND1'?'Rejected':'',
                cell: (row) => {
                    return [
                        <div className="d-flex" key={row}>
                            {row.evaluation_status &&
                                row.evaluation_status == 'SELECTEDROUND1' && (
                                    <span className="text-success">
                                        Accepted
                                    </span>
                                )}
                            {row.evaluation_status == 'REJECTEDROUND1' && (
                                <span className="text-danger">Rejected</span>
                            )}
                        </div>
                    ];
                },
                width: '10%'
            },
            
            {
                name: 'Actions',
                cell: (params) => {
                    return [
                        <div className="d-flex" key={params}>
                            <div
                                className="btn btn-primary btn-lg mr-5 mx-2"
                                onClick={() => {
                                    setIdeaDetails(params);
                                    setIsDetail(true);
                                    let index=0;
                                    tableData?.forEach((item, i)=>{
                                        if(item?.challenge_response_id==params?.challenge_response_id){
                                            index=i;
                                        }
                                    });
                                    setCurrentRow(index+1);
                                }}
                            >
                                View
                            </div>
                        </div>
                    ];
                },
                width: '8%',
                left: true
            }
        ]
    };

    const evaluatedIdeaL2 = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                selector: (row) => row.key,
                sortable: true,
                width: '9%'
            },
            {
                name: 'Team Name',
                selector: (row) => row.team_name || '',
                sortable: true,
                width: '20%'
            },
            {
                name: 'SDG',
                selector: (row) => row.sdg,
                width: '25%'
            },
            {
                name: 'Submitted By',
                selector: (row) => row.initiated_name,
                width: '23%'
            },
            {
                name: 'overall',
                cell :(row) => {
                    return[row.evaluator_ratings ? row.evaluator_ratings.length > 0 ? average(row.evaluator_ratings[0].overall) :' ' :' '];},
                 width : '15%'
            },

            {
                name: 'Actions',
                cell: (params) => {
                    return [
                        <div className="d-flex" key={params}>
                            <div
                                className="btn btn-primary btn-lg mr-5 mx-2"
                                onClick={() => {
                                    setIdeaDetails(params);
                                    setIsDetail(true);
                                    let index=0;
                                    tableData?.forEach((item, i)=>{
                                        if(item?.challenge_response_id==params?.challenge_response_id){
                                            index=i;
                                        }
                                    });
                                    setCurrentRow(index+1);
                                }}
                            >
                                View
                            </div>
                        </div>
                    ];
                },
                width: '8%',
                left: true
            }
        ]
    };
    const evaluatedIdeafinal = {
        data: tableData && tableData.length > 0 ? tableData : [],
        columns: [
            {
                name: 'No',
                selector: (row) => row.key,
                sortable: true,
                width: '6%'
            },
            {
                name: 'Team Name',
                selector: (row) => row.team_name || '',
                sortable: true,
                width: '11.5%'
            },
            {
                name: 'SDG',
                selector: (row) => row.sdg,
                width: '10%'
            },
            {
                name: 'Submitted By',
                selector: (row) => row.initiated_name,
                width: '11.5%'
            },
            {
                name: 'overall',
                cell :(row) => {
                    return[row.evaluator_ratings ? row.evaluator_ratings.length > 0 ? average(row.evaluator_ratings[0].overall).toFixed(2) :' ' :' '];},
                 width : '7%'
            },
            {
                name: 'Novelity',
                cell :(row) => {
                    return[row.evaluator_ratings ? row.evaluator_ratings.length > 0 ? average(row.evaluator_ratings[0].param_1).toFixed(2) :' ' :' '];},
                 width : '8%'
            },
            {
                name: 'Usefulness',
                cell :(row) => {
                    return[row.evaluator_ratings ? row.evaluator_ratings.length > 0 ? average(row.evaluator_ratings[0].param_2).toFixed(2) :' ' :' '];},
                 width : '9%'
            },
            {
                name: 'Feasability',
                cell :(row) => {
                    return[row.evaluator_ratings ? row.evaluator_ratings.length > 0 ? average(row.evaluator_ratings[0].param_3).toFixed(2) :' ' :' '];},
                 width : '9%'
            },
            {
                name: 'Scalability',
                cell :(row) => {
                    return[row.evaluator_ratings ? row.evaluator_ratings.length > 0 ? average(row.evaluator_ratings[0].param_4).toFixed(2) :' ' :' '];},
                 width : '9%'
            },
            {
                name: 'Sustainability',
                cell :(row) => {
                    return[row.evaluator_ratings ? row.evaluator_ratings.length > 0 ? average(row.evaluator_ratings[0].param_5).toFixed(2) :' ' :' '];},
                 width : '11%'
            },

            {
                name: 'Actions',
                cell: (params) => {
                    return [
                        <div className="d-flex" key={params}>
                            <div
                                className="btn btn-primary btn-lg mr-5 mx-2"
                                onClick={() => {
                                    setIdeaDetails(params);
                                    setIsDetail(true);
                                    let index=0;
                                    tableData?.forEach((item, i)=>{
                                        if(item?.challenge_response_id==params?.challenge_response_id){
                                            index=i;
                                        }
                                    });
                                    setCurrentRow(index+1);
                                }}
                            >
                                View
                            </div>
                        </div>
                    ];
                },
                width: '8%',
                left: true
            }
        ]
    };

    const sel = level==='L1'? evaluatedIdea : level === 'L2' ? evaluatedIdeaL2 :  evaluatedIdeafinal;
    const showbutton = district && sdg;

    const handleNext=()=>{
        if(tableData && currentRow < tableData?.length){
            setIdeaDetails(tableData[currentRow]);
            setIsDetail(true);
            setCurrentRow(currentRow+1);
        }
    };
    const handlePrev=()=>{
        if(tableData && currentRow >= 1){
            setIdeaDetails(tableData[currentRow-2]);
            setIsDetail(true);
            setCurrentRow(currentRow-1);
        }
    };
    return (
        <Layout>
            <div className="container evaluated_idea_wrapper pt-5 mb-50">
                <div className="row">
                    <div className="col-12 p-0">
                        {!isDetail && (
                            <div>
                                <h2 className="ps-2 pb-3">{title} Ideas</h2>

                                <Container fluid className="px-0">
                                    <Row className="align-items-center">
                                        <Col md={2}>
                                            <div className="my-3 d-md-block d-flex justify-content-center">
                                                <Select
                                                    list={fullDistrictsNames}
                                                    setValue={setdistrict}
                                                    placeHolder={
                                                        'Select District'
                                                    }
                                                    value={district}
                                                />
                                            </div>
                                        </Col>
                                        <Col md={2}>
                                            <div className="my-3 d-md-block d-flex justify-content-center">
                                                <Select
                                                    list={SDGDate}
                                                    setValue={setsdg}
                                                    placeHolder={'Select SDG'}
                                                    value={sdg}
                                                />
                                            </div>
                                        </Col>
                                        {level==='L1' && 
                                        <Col md={2}>
                                        <div className="my-3 d-md-block d-flex justify-content-center">
                                            <Select
                                                list={Allevalnamelist}
                                                setValue={setevalname}
                                                placeHolder={'Select evaluator name'}
                                                value={evalname}
                                            />
                                        </div>
                                    </Col>}

                                        {title === 'Rejected' ? (
                                            <Col md={3}>
                                                <div className="my-3 d-md-block d-flex justify-content-center">
                                                    <Select
                                                        list={ReasonsOptions}
                                                        setValue={setReason}
                                                        placeHolder={
                                                            'Select Reason for rejection'
                                                        }
                                                        value={reason}
                                                    />
                                                </div>
                                            </Col>
                                        ) : (
                                            ''
                                        )}
                                        <Col md={2}>
                                                <div className="text-center">
                                                    <Button
                                                        btnClass={showbutton ? 'primary': 'default'}
                                                        size="small"
                                                        label="Search"
                                                        disabled={!showbutton}
                                                        onClick={() =>
                                                            handleclickcall()
                                                        }
                                                    />
                                                </div>
                                            </Col>
                                        <Col md={title === 'Rejected' ? 1 : level === 'L1'? 4 : 6}>
                                            <div className="text-right">
                                                <Button
                                                    btnClass="primary"
                                                    size="small"
                                                    label="Back"
                                                    onClick={() =>
                                                        history.goBack()
                                                    }
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        )}
                        {
                        showspin && <div className='text-center mt-5'>
                        <Spinner animation="border" variant="secondary"/>
                        </div>
                        }
                        {!showspin && 
                        (!isDetail ? (
                            <div className="bg-white border card pt-3 mt-5">
                                <DataTableExtensions
                                    print={false}
                                    export={false}
                                    {...sel}
                                >
                                    <DataTable
                                        data={tableData || []}
                                        defaultSortField="id"
                                        defaultSortAsc={false}
                                        pagination
                                        highlightOnHover
                                        fixedHeader
                                        subHeaderAlign={Alignment.Center}
                                        paginationRowsPerPageOptions={[
                                            10, 25, 50, 100
                                        ]}
                                        paginationPerPage={10}
                                        onChangePage={(page)=>setTablePage(page)}
                                        paginationDefaultPage={tablePage}
                                    />
                                </DataTableExtensions>
                            </div>
                        ) : (
                            <ViewDetail
                                ideaDetails={ideaDetails}
                                setIsDetail={setIsDetail}
                                handleNext={handleNext}
                                handlePrev={handlePrev}
                                currentRow={currentRow}
                                dataLength={tableData && tableData?.length}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ViewSelectedIdea;