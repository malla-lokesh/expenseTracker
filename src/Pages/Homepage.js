import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import './homepage.css';
import { themeActions } from "../Store/ThemeReducer";
import { expenseActions } from "../Store/ExpenseReducer";
import axios from "axios";

const Homepage = () => {
    const idToken = useSelector(state => state.authentication.idToken);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Choose a category');
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editExpenseId, setEditExpenseId] = useState('');
    const dispatch = useDispatch();
    const expensesFromCentralStore = useSelector(state => state.expense.expenses);
    const premium = useSelector(state => state.expense.activatePremium);
    const premiumActivated = useSelector(state => state.theme.showThemeButton);
    const email = useSelector(state => state.authentication.email);

    const fetchExpenses = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://expensetracker-6b995-default-rtdb.firebaseio.com/${email}expenses.json`)
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
    }, [dispatch, email]);

    useEffect(() => {
        fetchExpenses();
        return () => {
            dispatch(expenseActions.addExpense([]));
            dispatch(themeActions.showThemeButton());
        };
    }, [dispatch, fetchExpenses]);

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
                const response = await axios.put(`https://expensetracker-6b995-default-rtdb.firebaseio.com/${email}expenses/${editExpenseId}.json`, expense);
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
                const response = await axios.post(`https://expensetracker-6b995-default-rtdb.firebaseio.com/${email}expenses.json`, expense)
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
        axios.delete(`https://expensetracker-6b995-default-rtdb.firebaseio.com/${email}expenses/${expenseId}.json`)
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

    const verfiyEmailHandler = () => {
        fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBWaj0fZXJolWpm6wbdt_Nd4SDxmFgeEFU`, {
            method: 'POST',
            body: JSON.stringify({
                requestType: 'VERIFY_EMAIL',
                idToken: idToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
            }).then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    res.json().then(data => alert(data.error.message))
                }
            })
    }

    return <React.Fragment> 
        <div>
            <button type='button' onClick={verfiyEmailHandler}>
                Click here
            </button>
             to verify your email
        </div>
        <div className="flex h-screen pt-24 bg-stone-50 min-[0px]:flex-col sm:flex-col lg:flex-row ">
            <div className="p-4 flex items-center">
                <form onSubmit={expenseFormSubmitHandler} className="flex flex-col bg-stone-100 border border-stone-100 rounded-lg p-4 gap-4 shadow-md">
                    <div>
                        <div className="text-lg text-center text-stone-900">
                            Make note of your expense
                        </div>
                        <hr className="border border-red-900 my-3"/>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className='block mb-1'>Amount</label>
                            <input 
                                className='p-1 focus:outline-none rounded focus:ring focus:ring-stone-400 focus:ring-2'
                                type='number' 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)}
                                min={1} 
                                placeholder="amount" 
                                required/>
                        </div>
                        <div>
                            <label className='block mb-1'>Date</label>
                            <input 
                                className='p-1 focus:outline-none rounded focus:ring focus:ring-stone-400 focus:ring-2'
                                type='date' 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required/>
                        </div>
                    </div>
                    <div>
                        <label className='block mb-1'>Description</label>
                        <textarea
                            rows={4}
                            cols={50}
                            name="textarea"
                            className='p-1 max-h-50 resize-none focus:outline-none rounded focus:ring focus:ring-stone-400 focus:ring-2'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder='Describe something about your expense...'>
                        </textarea>
                    </div>
                    <select className='p-1 mb-1 focus:outline-none rounded focus:ring focus:ring-stone-400 focus:ring-2' value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option disabled>Choose a category</option>
                        <option value='food'>Food</option>
                        <option value='petrol'>Petrol</option>
                        <option value='credit card'>Credit Card</option>
                        <option value='courses'>Courses</option>
                    </select>
                    <button 
                        className='p-1 text-stone-600 hover:text-stone-800 focus:outline-none rounded bg-stone-300 hover:bg-stone-400 focus:ring focus:ring-stone-400 focus:ring-2'
                        type='submit'
                    >
                        {!editMode ? 'Add Expense' : 'Edit expense'}
                    </button>
                </form>
            </div>
            <div className="grow p-5 min-h-screen max-h-96 overflow-auto">
                {premium && !premiumActivated && <button className='' type='button' onClick={premiumHandler} >Activate Premium 🌟</button>}
                {premium && premiumActivated && <button className='' type='button' onClick={downloadCSV}>Download your expenses 📊</button>}
                {isLoading && <p>Loading your expenses...</p>}
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                    <tr>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                            <div className="flex justify-center">
                                Name
                            </div>
                        </th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                            <div className="flex items-center justify-center">
                                Description
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                    className="w-5 h-5 stroke-red-900">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                            </div>
                        </th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                            <div className="flex items-center justify-center">
                                Amount
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                    className="w-5 h-5 stroke-red-900">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                            <div className="flex justify-center">
                                Change / Edit
                            </div>
                        </th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                            <div className="flex justify-center">
                                Delete
                            </div>
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {expensesFromCentralStore!=null && expensesFromCentralStore.map(expenseItem => {
                            const expenseId = expenseItem[0]; // string
                            const expense = expenseItem[1]; // object { amount, description, category }
                            return <tr className="odd:bg-stone-50" key={expenseId}>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    {expense.category}
                                </td>
                                <td className="whitespace-nowrap max-w-xs overflow-hidden overflow-ellipsis px-4 py-2 text-gray-700">
                                    {expense.description}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {expense.amount}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                        className="inline-block w-5 h-5 mr-2 cursor-pointer stroke-orange-400 hover:stroke-orange-500 hover:w-6 hover:h-6"
                                        onClick={() => {editExpenseHandler(expenseItem)}}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                        className="inline-block w-5 h-5 cursor-pointer stroke-red-900 hover:stroke-red-700 hover:w-6 hover:h-6 hover:fill-red-900 hover:stroke-stone-50"
                                        onClick={() => {deleteExpenseHandler(expenseId)}}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </React.Fragment>
};

export default Homepage;