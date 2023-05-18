import { Card, CardBody } from 'reactstrap';
import institutions from '../../assets/media/university.png';
import idea from '../../assets/media/idea.png';
import people from '../../assets/media/people.png';
import team from '../../assets/media/team.png';
import { useTranslation } from 'react-i18next';


const MapdataCard = ({ values, all,districtName }) => {
    const { t } = useTranslation();
    return (
        <>
            {all && !all?.district_name ? (
                <div className="d-flex flex-column card-width">
                    <Card className="card border-0 text-dark bg-light mb-3 ">
                        <CardBody>
                            <h2 className="text-uppercase">
                                {values?.district_name &&
                                values?.district_name === 'all'
                                    ? 'Andhra Pradesh'
                                    : districtName}
                            </h2>
                        </CardBody>
                    </Card>
                    <div className="mb-5 d-flex align-items-center">
                        <img
                            src={institutions}
                            alt="institutions"
                            className=" mx-4"
                        />
                        <div>
                            <h4>
                                {!values?.overall_schools
                                    ? '0'
                                    : `${values?.reg_schools}`}
                            </h4>
                            <small className="lightgreen">{t('home_tl.institutions')}</small>
                        </div>
                    </div>
                    <div className="mb-5 d-flex align-items-center ">
                        <img src={people} alt="teams" className="mx-4" />
                        <div>
                            <h4>{values?.teams ? values?.teams : '0'}</h4>
                            <small className="lightgreen">{t('home_tl.student_teams')}</small>
                        </div>
                    </div>
                    <div className="mb-5 d-flex align-items-center ">
                        <img src={team} alt="teams" className="mx-4" />
                        <div>
                            <h4>{values?.students ? values?.students : '0'}</h4>
                            <small className="lightgreen">{t('home_tl.students')}</small>
                        </div>
                    </div>
                    <div className="mb-5 d-flex align-items-center">
                        <img src={idea} alt="idea" className=" mx-4" />
                        <div>
                            <h4>{!values.ideas ? 0 : values.ideas}</h4>
                            <small className="lightgreen">{t('home_tl.ideas')}</small>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column card-width">
                    <Card className="card border-0 text-dark bg-light mb-3">
                        <CardBody>
                            <h2 className="">{'Andhra Pradesh'}</h2>
                        </CardBody>
                    </Card>
                    <div className="mb-5 d-flex align-items-center">
                        <img
                            src={institutions}
                            alt="institutions"
                            className=" mx-4"
                        />
                        <div>
                            <h4>
                                {!all?.overall_schools
                                    ? '0'
                                    : `${all?.reg_schools}`}
                            </h4>
                            <small className="lightgreen">{t('home_tl.institutions')}</small>
                        </div>
                    </div>
                    <div className="mb-5 d-flex align-items-center ">
                        <img src={people} alt="teams" className="mx-4" />
                        <div>
                            <h4>{all?.teams ? all?.teams : '0'}</h4>
                            <small className="lightgreen">{t('home_tl.student_teams')}</small>
                        </div>
                    </div>
                    <div className="mb-5 d-flex align-items-center ">
                        <img src={team} alt="teams" className="mx-4" />
                        <div>
                            <h4>{all?.students ? all?.students : '0'}</h4>
                            <small className="lightgreen">{t('home_tl.students')}</small>
                        </div>
                    </div>
                    <div className="mb-5 d-flex align-items-center">
                        <img src={idea} alt="idea" className=" mx-4" />
                        <div>
                            <h4>{!all.ideas ? 0 : all.ideas}</h4>
                            <small className="lightgreen">{t('home_tl.ideas')}</small>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MapdataCard;