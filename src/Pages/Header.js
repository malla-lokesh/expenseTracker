import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthReducer";
import './Header.css';
import Tooltip from "../Components/ToolTip";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const isLoggedIn = useSelector(state => state.authentication.isLoggedIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(authActions.setIdToken(''));
        dispatch(authActions.setEmail(''));
        dispatch(authActions.logout());
        navigate('/', { replace: true });
    }

    return (
        <React.Fragment>
            <header className="bg-stone-200 p-5 fixed z-10 inset-x-0 top-0 drop-shadow-md">
                <div className="flex justify-between items-center">
                    <div className="flex-col">
                        <div className="text-3xl text-gray-900 font-medium font-serif">
                            Expense Tracker
                        </div>
                        <p className="pt-1 text-sm text-gray-500">
                            Master your money, track every penny! 💰📊
                        </p>
                    </div>
                    {isLoggedIn && (
                        <div className="flex items-center md:w-40 justify-around min-[0px]:w-24">
                            <Tooltip text="profile">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                    className="w-6 h-6 cursor-pointer hover:fill-white hover:w-7 hover:h-7 hover:stroke-red-900"
                                    onClick={() => navigate('/updateProfilePage')}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </Tooltip>
                            <Tooltip text="logout">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" 
                                    className="w-6 h-6 cursor-pointer hover:fill-white hover:w-7 hover:h-7 hover:stroke-red-900 focus:w-6 focus:h-6"
                                    onClick={logoutHandler}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg> 
                            </Tooltip>
                        </div>
                    )}
                </div>
            </header>
        </React.Fragment>
    );
}

export default Header;
