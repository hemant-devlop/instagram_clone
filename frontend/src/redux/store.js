import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//slices
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import chatSlice from "./chatSlice";

//persist configration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

// Root reducer combining all slices
const rootReducer=combineReducers({
    auth:authSlice,
    post:postSlice,
    chat:chatSlice
})

//created persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//store configuraion
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;