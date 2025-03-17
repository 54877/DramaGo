import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./slice/loadingSlice";
import toastReducer from "./slice/toastSlice";
import defaultDataReducer from "./slice/defaultDataSlice";


export const store = configureStore({
    reducer:{
        loadingStore:loadingReducer,
        toastStore:toastReducer,
        defaultDataStore:defaultDataReducer,
    }
});

