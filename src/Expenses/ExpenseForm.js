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

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://expensetrackerstorage-default-rtdb.firebaseio.com/expenses.json')
            const arrayObject = Object.entries(response.data);
            const expenseArray = arrayObject.map(array => array[1]);
            setExpenses(expenseArray);
        } catch (error) {
            console.error('Error fetching expenses: ', error);
        }
        setIsLoading(false);
    }

    const expenseFormSubmitHandler = async (event) => {
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
        {isLoading && <p>Loading your expenses...</p>}
        {expenses!=null && expenses.map(expense => {
            return <div key={expense.id}>
                <div key={Math.random()}>
                    {expense.amount} - spent for {expense.category}
                </div>
                <div>{expense.description}</div>
            </div>
        })}
    </React.Fragment>
};

export default ExpenseForm;