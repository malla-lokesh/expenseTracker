import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthReducer";
import ExpenseReducer from "./ExpenseReducer";
import ThemeReducer from './ThemeReducer';

const centralStore = configureStore({
    reducer: {
        authentication: AuthReducer,
        expense: ExpenseReducer,
        theme: ThemeReducer
    }
})

export default centralStore;