/* eslint-disable indent */
import { useEffect, useRef, useState } from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import { Button } from '../../stories/Button';
import jsPDF from 'jspdf';
import { getCurrentUser } from '../../helpers/Utils';
import TeacherCertificate from '../../assets/media/img/certificates/Mentor_APUpdated.png';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getDistrictData } from '../../redux/studentRegistration/actions';
import Select from '../Evaluation/Pages/Select';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';

const MyCertificate = () => {
    const plist = [
        'mentorCourseCompletion',
        'studentCourseCompletion',
        'studentParticipation'
    ];
    const dispatch = useDispatch();
    const [district, setdistrict] = useState('');
    const [certificateType, setcertificateType] = useState('');
    const [userList, setuserList] = useState('');
    const [name, setname] = useState('test');
    const [org, setorg] = useState('testing org');
    const [showcom, setshowcom] = useState(false);
    const [showspin, setshowspin] = useState(false);
    const [discount,setdiscount] =useState(0);
    const fullDistrictsNames = useSelector(
        (state) => state?.studentRegistration?.dists
    );
    const { t } = useTranslation();
    const pdfRef = useRef(null);
    const currentUser = getCurrentUser('current_user');
    const handleCertificateDownload = () => {
        const content = pdfRef.current;
        const doc = new jsPDF('l', 'px', [211, 298]);
        doc.html(content, {
            callback: function (doc) {
                doc.save(`${org}_${name}_TeacherCertificate.pdf`);
            }
        });
    };
    useEffect(() => {
        dispatch(getDistrictData());
    }, []);

    useEffect(() => {
        setTimeout(handleCertificateDownload(),1500);
    }, [name]);

    const handleclickcall = () => {
        setdiscount(0);
        setshowcom(false);
        setshowspin(true);
        promoteapi(`district=${district}&condition=${certificateType}`);
    };
    async function promoteapi(id) {
        var config = {
            method: 'get',
            url: `${
                process.env.REACT_APP_API_BASE_URL +
                '/students/downloadCertificate?' +
                id
            }`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser?.data[0]?.token}`
            }
        };
        await axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setuserList(response.data.data);
                    setshowspin(false);
                }
            })
            .catch(function (error) {
                console.log(error);
                setshowspin(false);
            });
    }
    let count = 0;
    const handleStart = () => {
        const timeInterval = setInterval(() => {
            if (userList.length == count + 1) {
                clearInterval(timeInterval);
                setshowcom(true);
            }
            setdiscount(count+1);
            setorg(userList[count].team.mentor.organization.organization_name);
            setname(userList[count].full_name);
            count = count + 1;
        }, 3000);
    };

    return (
        <Container className="presuervey mb-50 mt-5 ">
            <Select
                list={fullDistrictsNames}
                setValue={setdistrict}
                placeHolder={'Select district'}
                value={district}
            />
            <Select
                list={plist}
                setValue={setcertificateType}
                placeHolder={'Select certificate'}
                value={certificateType}
            />
            <Button
                btnClass={'primary'}
                size="small"
                label="Search"
                onClick={() => handleclickcall()}
            />
            <Button
                btnClass={'primary'}
                size="small"
                label="start"
                onClick={() => handleStart()}
            />
            {showspin && 
            <div className="text-center mt-5">
                <Spinner animation="border" variant="secondary" />
            </div>}
            <h1 className='text-info'>{discount}/{userList.length}</h1>
            
            {showcom && <h1 className="text-success">COMPLTED</h1>}
            
            <Card className="course-sec-basic p-5">
                <CardBody>
                    <div ref={pdfRef} style={{ position: 'relative' }}>
                        <span
                            className="text-capitalize"
                            style={{
                                position: 'absolute',
                                top: '8.1rem',
                                left: '10rem',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                fontFamily: 'courier',
                                color: '#000000'
                            }}
                        >
                            {name}
                        </span>
                        <span
                            className="text-capitalize"
                            style={{
                                position: 'absolute',
                                top: '9.6rem',
                                left: '5rem',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                fontFamily: 'courier',
                                color: '#000000'
                            }}
                        >
                            {org}
                        </span>
                        <img
                            src={TeacherCertificate}
                            alt="certificate"
                            style={{
                                width: '297px',
                                height: '209px'
                                //border: '1px solid #ccc'
                            }}
                        />
                    </div>
                    <div className="text-right">
                        <Button
                            button="submit"
                            label={t('teacher_certificate.download')}
                            btnClass="primary mt-4"
                            size="small"
                            style={{ marginRight: '2rem' }}
                            onClick={handleCertificateDownload}
                        />
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
};

export default MyCertificate;
