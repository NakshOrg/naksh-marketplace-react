import { combineReducers } from 'redux';

import nearReducer from './reducers/nearReducer';
import dataReducer from './reducers/dataReducer';

const appReducer = combineReducers({
    nearReducer,
    dataReducer
});

export default appReducer;