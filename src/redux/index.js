import { combineReducers } from 'redux';

import nearReducer from './reducers/nearReducer';

const appReducer = combineReducers({
    nearReducer
});

export default appReducer;