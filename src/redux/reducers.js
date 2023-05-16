import { combineReducers } from 'redux';
import home from './home/reducer';

const reducers = combineReducers({
    home
});
const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        return reducers({}, action);
    }
  
    return reducers(state, action);
};
export default rootReducer;
