import { configureStore } from '@reduxjs/toolkit';

import nearReducer from './reducers/nearReducer';
import dataReducer from './reducers/dataReducer';
import thunk from 'redux-thunk';

const store = configureStore({
    middleware: [thunk],
    reducer: {
        nearReducer,
        dataReducer
    }
})

export default store;