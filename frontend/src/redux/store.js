import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//slices
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import chatSlice from "./chatSlice";
import socketSlice from "./socketSlice";
import rtnSlice from "./rtnSlice";

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
    chat:chatSlice,
    socketio:socketSlice,
    realTimeNotification:rtnSlice,
})

//created persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//store configuraion
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["socketio/setSocket",FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,],
                ignoredPaths:["socketio.socket"]
            },
        }),
});

export default store;