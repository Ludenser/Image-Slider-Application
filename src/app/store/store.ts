import { configureStore } from '@reduxjs/toolkit';
import { catApi } from '../../api/catApi';
import rootReducer from './rootReducer';

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(catApi.middleware),
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
