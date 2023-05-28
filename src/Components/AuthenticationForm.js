import React, { useState } from "react";
import './AuthenticationForm.css';

const AuthenticationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const setConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.target.value);
    }

    const authenticationFormSubmitHandler = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            return;
        }

        fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDbZODcPqKDtyrTyZl4UpkMuFUsMsfH9Aw`, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.ok) {
                console.log('Account created successfully');
            } else {
                throw new Error('Account creation failed!');
            }
        }).catch(error => console.log(error));
    }

    return <React.Fragment>
        <form className='authenticationForm' onSubmit={authenticationFormSubmitHandler}>
            <h2 className='formHeading'>SignUp</h2>
            <input className='emailInput' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' required/>
            <input className='passwordInput' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' required/>
            <input className='confirmPasswordInput' type='password' value={confirmPassword} onChange={setConfirmPasswordHandler} placeholder='confirm password' required/>
            <button type='submit' className='authenticationFormSubmitButton'>
                Sign up
            </button>
        </form>
        <button className='authenticationCheckingButton'>
            Have an account? Login
        </button>
    </React.Fragment>
};

export default AuthenticationForm;