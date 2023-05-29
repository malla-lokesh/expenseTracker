import React, { useState } from "react";

const ExpenseContext = React.createContext({
    expenses: [],
    addExpense: () => {}
})

export const ExpenseContextProvider = (props) => {
    const [expenses, setExpenses] = useState([]);

    const addExpenseHandler = (expense) => {
        setExpenses((prevExpenses) => [...prevExpenses, {...expense}]);
    }

    const expenseContextValue = {
        expenses: expenses,
        addExpense: addExpenseHandler
    }

    return <ExpenseContext.Provider value={expenseContextValue}>
        {props.children}
    </ExpenseContext.Provider>
}

export default ExpenseContext;