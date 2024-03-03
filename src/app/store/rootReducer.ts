import { combineReducers } from '@reduxjs/toolkit';
import { catApi } from '../../api/catApi';

const rootReducer = combineReducers({
  [catApi.reducerPath]: catApi.reducer,
});

export default rootReducer;
