import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../Store/AuthReducer";

const AuthenticationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changeToLoginForm, setChangeToLoginForm] = useState(false);
    const [redirectToHomepage, setRedirectToHomepage] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeFormHandler = () => {
        setEmail('');
        setPassword('');
        setErrorMsg('');
        setSuccessMsg('');
        setChangeToLoginForm((prevState) => !prevState);
    }

    const setConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.target.value);
    }

    const authenticationFormSubmitHandler = (event) => {
        event.preventDefault();

        if (!changeToLoginForm && (password !== confirmPassword)) {
            setPassword('');
            setConfirmPassword('');
            setErrorMsg(`password's didn't match`)
            return;
        }

        if(changeToLoginForm) {
            fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBWaj0fZXJolWpm6wbdt_Nd4SDxmFgeEFU`, {
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
                    return res.json();
                } else {
                    throw new Error('Invalid Email or Password!');
                }
            }).then(data => {
                dispatch(authActions.login(true));
                dispatch(authActions.setIdToken(data.idToken));
                const sanitizedEmail = data.email.replace(/[.@]/g, '');
                dispatch(authActions.setEmail(sanitizedEmail));
                setRedirectToHomepage(true);
            }).catch(error => {
                if (error.message === 'Failed to fetch') {
                    setErrorMsg('Network error');
                    return;
                } 
                setErrorMsg(error.message);
            });
        } else {
            fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBWaj0fZXJolWpm6wbdt_Nd4SDxmFgeEFU`, {
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
                    setSuccessMsg('Account Created successfully, please login now...')
                } else {
                    res.json().then(data => {
                        alert(data.error.message);
                    })
                }
            }).catch(error => setErrorMsg(error));
        }
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    }

    if (redirectToHomepage) {
        return navigate("/homepage");
    }

    return <React.Fragment>
        <div className={"flex min-[0px]:flex-col sm:flex-col md:flex-row lg:flex-row xxs:flex-col h-screen items-center sm:bg-gradient-to-r from-stone-200"}>
            <div className="flex-1">
                <div className="flex-col text-center">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium p-3 bg-stone-300 shadow-lg">
                        Expense Tracker
                    </div>
                    <div className="text-lg md:text-2xl text-red-900">
                        Take control on your daily expenses
                    </div>
                    <div className="text-md md:text-lg lg:text-lg text-red-900">
                        Track, Analyze, and Control Your Finances
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <form className="flex-col rounded-lg p-5 bg-stone-100 sm:w-96 lg:w-128 mx-auto shadow-xl" onSubmit={authenticationFormSubmitHandler}>
                <div className="text-lg text-center text-stone-900">
                    <div className="flex flex-col justify-center items-center">
                        {!changeToLoginForm ? (
                        <span>Get started today | Sign in</span>
                        ) : (
                            <>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-8 h-8 stroke-stone-700"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span>Login</span>
                            </>
                        )}
                    </div>
                </div>
                    <hr className="border border-red-900 my-3"/>
                    <div className="mb-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="relative">
                            <input
                                className="p-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring focus:ring-stone-400 focus:ring-2" 
                                type='email'
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setSuccessMsg('')} 
                                placeholder='email' 
                                required
                            />
                            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth="1.5" 
                                    stroke="currentColor" 
                                    className="h-4 w-4 stroke-stone-400"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" 
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input 
                                className="p-2 mt-1 w-full rounded-md border-gray-700 bg-white text-sm text-gray-700 focus: outline-none focus:ring focus:ring-stone-400 focus:ring-2" 
                                type={showPassword ? 'text' : 'password'}
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder={`password`} 
                                required
                                onFocus={() => {
                                    setErrorMsg('');
                                    setSuccessMsg('');
                                    setShowPassword(false);
                                }}
                            />
                            {password.trim().length>=1 ? <span 
                                className="absolute inset-y-0 end-0 grid place-content-center px-4"
                                >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    strokeWidth="1.5" 
                                    stroke="currentColor" 
                                    className="h-4 w-4 cursor-pointer stroke-stone-400 hover:stroke-stone-500"
                                    onMouseDown={() => setShowPassword(true)}
                                    onMouseUp={() => setShowPassword(false)}
                                    onMouseOut={() => setShowPassword(false)}
                                >
                                    {!showPassword ? (
                                        <>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </>
                                        ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                        />
                                    )}
                                </svg>
                            </span>
                            :
                            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                    className="w-4 h-4 stroke-stone-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                </svg>
                            </span>
                            }
                        </div>
                    </div>
                    {!changeToLoginForm && 
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    className="p-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring focus:ring-stone-400 focus:ring-2" 
                                    type={showConfirmPassword ? 'text' : 'password'} 
                                    value={confirmPassword} 
                                    onChange={setConfirmPasswordHandler} 
                                    placeholder='confirm password' 
                                    required
                                    onFocus={() => {
                                        setErrorMsg('');
                                        setSuccessMsg('');
                                        setShowConfirmPassword(false);
                                    }}
                                />
                                {confirmPassword.trim().length>=1 ? <span 
                                    className="absolute inset-y-0 end-0 grid place-content-center px-4"
                                    >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth="1.5" 
                                        stroke="currentColor" 
                                        className="h-4 w-4 text-gray-400 cursor-pointer stroke-stone-400 hover:stroke-stone-500"
                                        onMouseDown={() => setShowConfirmPassword(true)}
                                        onMouseUp={() => setShowConfirmPassword(false)}
                                        onMouseOut={() => setShowConfirmPassword(false)}
                                    >
                                        {!showConfirmPassword ? (
                                            <>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </>
                                            ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                            />
                                        )}
                                    </svg>
                                </span>
                                :
                                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                        className="w-4 h-4 stroke-stone-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                    </svg>
                                </span>
                                }
                            </div>
                        </div>
                    }
                    <p className="text-red-800 mb-3">{errorMsg}</p>
                    <p className="text-emarald-500 mb-3">{successMsg}</p>
                    <hr className="mt-3 mb-3"/>
                    <button type='submit' className="flex justify-center items-center w-full bg-stone-400 hover:bg-stone-500 text-lg text-white pl-3 pr-3 pb-1 pt-1 rounded-md focus:outline-none">
                        {changeToLoginForm ? 'Login' : 'Sign in'} 
                    </button>
                    <div className={changeToLoginForm ? "flex justify-between mt-2" : "text-center mt-2"}>
                        <button className="text-stone-800 focus:outline-none custom-delay" type="button" onClick={changeFormHandler}>
                            {changeToLoginForm ? (
                                <>
                                    <span>New here?</span>{" "}
                                    <span className="text-red-900 underline hover:text-lg">Sign up</span>
                                    <span>!</span>
                                </>
                                ) : (
                                <>
                                    <span>Have an account?</span>{" "}
                                    <span className="text-red-900 underline hover:text-lg">Login</span>
                                    <span>!</span>
                                </>
                            )}
                        </button>
                        {changeToLoginForm && 
                            <button 
                                className="font-thin text-sm mt-1 hover:underline focus:outline-none hover:text-base" 
                                onClick={() => navigate('/forgotpassword')}
                            > 
                                forgot password
                            </button>
                        }
                    </div>
                </form>
            </div>
        </div>
    </React.Fragment>
};

export default AuthenticationForm;