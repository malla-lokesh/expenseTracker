import React, { useState } from "react";
import './AuthenticationForm.css';
import { Redirect, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/AuthReducer";

const AuthenticationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changeToLoginForm, setChangeToLoginForm] = useState(false);
    const [redirectToHomepage, setRedirectToHomepage] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const changeFormHandler = () => {
        setChangeToLoginForm((prevState) => !prevState);
    }

    const setConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.target.value);
    }

    const authenticationFormSubmitHandler = (event) => {
        event.preventDefault();

        if (!changeToLoginForm && (password !== confirmPassword)) {
            console.log(`Passwords didn't match`);
            return;
        }

        if(changeToLoginForm) {
            fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDbZODcPqKDtyrTyZl4UpkMuFUsMsfH9Aw`, {
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
                    console.log('logged in successfully!');
                    return res.json();
                } else {
                    res.json().then(data => {
                        alert(data.error.message)
                    });
                }
            }).then(data => {
                dispatch(authActions.login(true));
                dispatch(authActions.setIdToken(data.idToken));
                setRedirectToHomepage(true);
            }).catch(error => console.log(error));
        } else {
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
                    res.json().then(data => {
                        alert(data.error.message);
                    })
                }
            }).catch(error => console.log(error));
        }
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    if (redirectToHomepage) {
        return <Redirect to="/homepage" />;
    }

    return <React.Fragment>
        <form className='authenticationForm' onSubmit={authenticationFormSubmitHandler}>
            <h2 className='formHeading'>{changeToLoginForm ? 'Login' : 'SignUp'}</h2>
            <input className='emailInput' type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' required/>
            <input className='passwordInput' type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' required/>
            {!changeToLoginForm && <input className='confirmPasswordInput' type='password' value={confirmPassword} onChange={setConfirmPasswordHandler} placeholder='confirm password' required/>}
            {changeToLoginForm && <button onClick={() => history.push('/forgotpassword')}>forgot password</button>}
            <button type='submit' className='authenticationFormSubmitButton'>
                {changeToLoginForm ? 'Login' : 'Sign up'}
            </button>
        </form>
        <button className='authenticationCheckingButton' type='button' onClick={changeFormHandler}>
            {changeToLoginForm ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
    </React.Fragment>
};

export default AuthenticationForm;