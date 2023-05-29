import React, { useContext, useState } from "react";
import ExpenseContext from "../Components/ExpenseStore/ExpenseContext";

const ExpenseForm = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Choose a category');
    const expenseContext = useContext(ExpenseContext);

    const expenseFormSubmitHandler = (event) => {
        event.preventDefault();

        const expense = {
            id: Math.random(),
            amount: amount,
            description: description,
            category: category
        }
        
        setAmount('');
        setDescription('');
        setCategory('Choose a category');
        expenseContext.addExpense(expense);
    }

    const expenses = expenseContext.expenses.map(expense => {
        return <div key={expense.id}>
            <div key={Math.random()}>
                {expense.amount} - spent for {expense.category}
            </div>
            <div>{expense.description}</div>
        </div>
    })

    return <React.Fragment>
        <form onSubmit={expenseFormSubmitHandler}>
            <input type='number' value={amount} onChange={(e) => setAmount(e.target.value)} min={1} placeholder="enter amount you've spent" required/>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Write something about your expense...'/>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option disabled>Choose a category</option>
                <option value='food'>Food</option>
                <option value='petrol'>Petrol</option>
                <option value='credit card'>Credit Card</option>
                <option value='courses'>Courses</option>
            </select>
            <button type='submit'>Add Expense</button>
        </form>
        <hr/>
        {expenses}
    </React.Fragment>
};

export default ExpenseForm;