import { createSlice } from "@reduxjs/toolkit";

const initialExpenseState = { 
    expenses: [],
    totalSpentAmount: 0,
    activatePremium: false,
    showExpenses: false,
}

const expenseSlice = createSlice({
    name: 'expense',
    initialState: initialExpenseState,
    reducers: {
        addExpense(state, action) {
            state.expenses = action.payload;
            let totalAmount = 0;
            state.expenses.map(expense => {
                totalAmount += Number(expense[1].amount);
                return null;
            })
            state.totalSpentAmount = totalAmount;
            if(state.totalSpentAmount >= 10000) {
                state.activatePremium = true;
            } else{
                state.activatePremium = false;
            }
        },
        showExpense(state) {
            state.showExpenses = !state.showExpenses;
        }
    }
})

export const expenseActions = expenseSlice.actions;

export default expenseSlice.reducer;