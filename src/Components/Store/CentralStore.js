import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./AuthReducer";
import ExpenseReducer from "./ExpenseReducer";

const centralStore = configureStore({
    reducer: {
        authentication: AuthReducer,
        expense: ExpenseReducer
    }
})

export default centralStore;