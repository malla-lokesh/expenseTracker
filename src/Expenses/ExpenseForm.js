import React, { useEffect, useState } from "react";
// import ExpenseContext from "../Components/ExpenseStore/ExpenseContext";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../Store/ExpenseReducer";
import { themeActions } from "../Store/ThemeReducer";

const ExpenseForm = () => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Choose a category');
    // const expenseContext = useContext(ExpenseContext);
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editExpenseId, setEditExpenseId] = useState('');
    const dispatch = useDispatch();
    const expensesFromCentralStore = useSelector(state => state.expense.expenses);
    const premium = useSelector(state => state.expense.activatePremium);
    const premiumActivated = useSelector(state => state.theme.showThemeButton);
    const email = useSelector(state => state.authentication.email);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://expensetrackerstorage-default-rtdb.firebaseio.com/${email}expenses.json`)
            if(response.data === null) {
                setIsLoading(false);
                return;
            }
            const array = Object.entries(response.data);
            dispatch(expenseActions.addExpense(array));
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
                const response = await axios.put(`https://expensetrackerstorage-default-rtdb.firebaseio.com/${email}expenses/${editExpenseId}.json`, expense);
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
                const response = await axios.post(`https://expensetrackerstorage-default-rtdb.firebaseio.com/${email}expenses.json`, expense)
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
        axios.delete(`https://expensetrackerstorage-default-rtdb.firebaseio.com/${email}expenses/${expenseId}.json`)
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

    const premiumHandler = () => {
        dispatch(themeActions.showThemeButton())
    }

    const downloadCSV = () => {
        const csvContent = [
          ["Amount", "Description", "Category"],
          ...expensesFromCentralStore.map((expenseItem) => {
            const expense = expenseItem[1];
            return [expense.amount, expense.description, expense.category];
          }),
        ]
          .map((row) => row.join(","))
          .join("\n");
    
        const csvData = new Blob([csvContent], { type: "text/csv" });
        const csvURL = URL.createObjectURL(csvData);
        const tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute("download", "expenses.csv");
        tempLink.click();
    };

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
        {premium && !premiumActivated && <button type='button' onClick={premiumHandler} >Activate Premium</button>}
        {premiumActivated && <button type='button' onClick={downloadCSV}>Download your expenses</button>}
        {isLoading && <p>Loading your expenses...</p>}
        {expensesFromCentralStore!=null && expensesFromCentralStore.map(expenseItem => {
            const expenseId = expenseItem[0]; // string
            const expense = expenseItem[1]; // object { amount, description, category }
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