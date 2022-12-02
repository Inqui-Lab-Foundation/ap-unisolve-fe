import Confetti from 'react-confetti';
import { useHistory } from 'react-router-dom';
import ResultStar from '../../../assets/media/quiz-result-star.png';
import { Button } from '../../../stories/Button';
import succesImg from "../../../assets/media/success1.jpeg";
import { useTranslation } from 'react-i18next';

const CourseSuccessMessage = () => {
    const { t } = useTranslation();
    const history = useHistory();
    return (
        <div className="container new-result">
            <Confetti className="w-100" />
            <div className="row justify-content-md-center ">
                <div className="col col-lg-9">
                    <div className="results-heading">
                        <img src={ResultStar} alt="star" />
                    </div>
                    <div className="congratulations text-center">
                        <div className="success_img text-center w-100">
                            <img src={succesImg} alt=".." /><br />
                        </div>
                        {t('student_course.course_scc')}
                    </div>
                    <div className='text-center'>
                        <Button
                            label={t('student_course.course_scc')}
                            btnClass="primary mt-4"
                            size="small"
                            onClick={() =>
                                history.push("/challenges")
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseSuccessMessage;
