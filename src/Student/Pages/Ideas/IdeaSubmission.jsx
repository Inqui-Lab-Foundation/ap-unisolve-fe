import { useLayoutEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../../helpers/Utils';
import { getStudentChallengeSubmittedResponse } from '../../../redux/studentRegistration/actions';
import IdeasPageNew from './IdeasPageCopy';
import SDG from './SDG';

const IdeaSubmission = () => {
    const dispatch = useDispatch();
    const language = useSelector(
        (state) => state?.studentRegistration?.studentLanguage
    );
    const { challengesSubmittedResponse } = useSelector(
        (state) => state?.studentRegistration
    );
    const currentUser = getCurrentUser('current_user');
    const [showChallenges, setShowChallenges] = useState(false);
    useLayoutEffect(() => {
        dispatch(
            getStudentChallengeSubmittedResponse(
                currentUser?.data[0]?.team_id,
                language
            )
        );
    }, [dispatch, language, currentUser?.data[0]?.team_id]);

    useLayoutEffect(() => {
        if (
            challengesSubmittedResponse &&
            challengesSubmittedResponse.length > 0
        ) {
            setShowChallenges(true);
        } else {
            setShowChallenges(false);
        }
    }, [challengesSubmittedResponse]);
    return showChallenges ? (
        <IdeasPageNew />
    ) : (
        <SDG setShowChallenges={setShowChallenges} />
    );
};

export default IdeaSubmission;
