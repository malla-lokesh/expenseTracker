import React, { useEffect, useState } from "react";
// import ExpenseContext from "../Components/ExpenseStore/ExpenseContext";
import axios from "axios";

const ExpenseForm = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Choose a category');
    // const expenseContext = useContext(ExpenseContext);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editExpenseId, setEditExpenseId] = useState('');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://expensetrackerstorage-default-rtdb.firebaseio.com/expenses.json')
            if(response.data === null) {
                setIsLoading(false);
                return;
            }
            const arrayObject = Object.entries(response.data);
            setExpenses(arrayObject);
        } catch (error) {
            console.error('Error fetching expenses: ', error);
        }
        setIsLoading(false);
    }

    const expenseFormSubmitHandler = async (event) => {
        event.preventDefault();

        const expense = {
            amount: amount,
            description: description,
            category: category
        }
        
        setAmount('');
        setDescription('');
        setCategory('Choose a category');

        if(editMode) {
            try {
                const response = await axios.put(`https://expensetrackerstorage-default-rtdb.firebaseio.com/expenses/${editExpenseId}.json`, expense);
                if(response.statusText === 'OK') {
                    fetchExpenses();
                } else {
                    throw new Error(response.data.error);
                }
            } catch(error) {
                alert(error);
            }
            setEditMode(false);
        } else {
            try {
                const response = await axios.post('https://expensetrackerstorage-default-rtdb.firebaseio.com/expenses.json', expense)
                if(response.statusText !== 'OK') {
                    alert('sending expense to firebase failed!');
                } else {
                    fetchExpenses();
                }
            } catch(error) {
                console.error('Error : ', error);
            }
        }
    }

    const deleteExpenseHandler = (expenseId) => {
        axios.delete(`https://expensetrackerstorage-default-rtdb.firebaseio.com/expenses/${expenseId}.json`)
        .then(response => {
            if(response.statusText === 'OK') {
                fetchExpenses();
            } else {
                throw new Error(response.data.error);
            }
        }).catch(error => alert(error))
    }

    const editExpenseHandler = async (expenseItem) => {
        const expenseId = expenseItem[0];
        const expense = expenseItem[1];
        setAmount(expense.amount);
        setDescription(expense.description);
        setCategory(expense.category);
        setEditExpenseId(expenseId);
        setEditMode(true);
    }

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
            <button type='submit'>{!editMode ? 'Add Expense' : 'Edit expense'}</button>
        </form>
        <hr/>
        {isLoading && <p>Loading your expenses...</p>}
        {expenses!=null && expenses.map(expenseItem => {
            const expenseId = expenseItem[0];
            const expense = expenseItem[1];
            return <div key={expenseId}>
                <div>
                    {expense.amount} - spent for {expense.category}
                </div>
                <div>{expense.description}</div>
                <button type='button' onClick={() => {editExpenseHandler(expenseItem)}}>edit</button>
                <button type='button' onClick={() => {deleteExpenseHandler(expenseId)}}>delete</button>
            </div>
        })}
    </React.Fragment>
};

export default ExpenseForm;