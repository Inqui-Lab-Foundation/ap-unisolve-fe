import './style.scss';
import Layout from '../../Layout.jsx';
import {
    Col,
    Container,
    Row
} from 'reactstrap';
import { getCurrentUser } from '../../../helpers/Utils';
import { useTranslation } from 'react-i18next';
import CommonPage from '../../../components/CommonPage';
import { Button } from '../../../stories/Button';
import { cardData } from './SDGData';
import { useDispatch, useSelector } from 'react-redux';
import { initiateIdea } from '../../../redux/studentRegistration/actions';
import { useHistory } from 'react-router-dom';

const SDG = ({setShowChallenges}) => {
    const currentUser = getCurrentUser('current_user');
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const dispatch = useDispatch();
    const history = useHistory();
    const { t } = useTranslation();
    const comingSoonText = t('dummytext.student_idea_sub');
    const showPage =false;
    const handleSelect = (data)=>{
        const initialSizeData = {
            sdg:data
        };
        dispatch(initiateIdea(currentUser?.data[0]?.team_id,language,history,initialSizeData,setShowChallenges));
    };
    return (
        <Layout>
            {!showPage ? (
                <CommonPage text={comingSoonText} />
            ) : (
                <Container className="mb-50 mt-5 ">
                    <h2>Sustainable Development Goals</h2>
                    <hr />
                    <Row>
                        {cardData &&
                            cardData?.length > 0 &&
                            cardData?.map((item, index) => {
                                return (
                                    <Col
                                        xl={3}
                                        lg={4}
                                        md={6}
                                        sm={6}
                                        className="flip_card_col mb-md-5 mb-3 d-flex justify-content-center"
                                        key={index}
                                    >
                                        <div className="flip-card">
                                            <div className="flip-card-inner">
                                                <div className="flip-card-front">
                                                    <img
                                                        src={
                                                            item?.goal_bg
                                                        }
                                                        alt="..."
                                                        style={{
                                                            width: '24rem',
                                                            height: '36rem'
                                                        }}
                                                    ></img>
                                                    <img
                                                        src={
                                                            item?.goal_logo
                                                        }
                                                        className="fixed-bottom ms-2 mb-2"
                                                        alt="..."
                                                        style={{
                                                            width: '150px',
                                                            height: '150px'
                                                        }}
                                                    ></img>
                                                </div>
                                                <div
                                                    className="flip-card-back px-2 py-3"
                                                    style={{
                                                        backgroundColor:
                                                            item?.bg_color
                                                    }}
                                                >
                                                    <h1 className="text-light opacity-50">
                                                        {item?.goal_number}
                                                    </h1>
                                                    <h2 className="text-white">
                                                        {item?.goal_title}
                                                    </h2>
                                                    <p>{item?.goal_text}</p>
                                                    <div className="choose_btn_box fixed-bottom mb-3">
                                                        <Button
                                                            btnClass="secondary"
                                                            onClick={()=>handleSelect(item?.goal_title)}
                                                            size="small"
                                                            label="Select"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                    </Row>
                </Container>
            )}
        </Layout>
    );
};

export default SDG;
