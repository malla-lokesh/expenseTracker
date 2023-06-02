import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthReducer";
import { themeActions } from "../Store/ThemeReducer";
import './Header.css';

const Header = () => {
    const isLoggedIn = useSelector(state => state.authentication.isLoggedIn);
    const showThemeButtton = useSelector(state => state.theme.showThemeButton);
    const theme = useSelector(state => state.theme.changeTheme);
    const premiumActivated = useSelector(state => state.expense.activatePremium);
    const dispatch = useDispatch();

    const logoutHandler = () => {
        dispatch(authActions.setIdToken(''));
        dispatch(authActions.setEmail(''));
        dispatch(authActions.logout());
    }

    return <React.Fragment>
        <div className='headerAndLogoutDiv'>
            <h1 style={{
                color: theme === 'dark' ? 'white' : 'black',
                backgroundColor: theme === 'dark' ? 'black' : 'white'
            }}>Welcome to Expense Tracker!!!</h1>
            {isLoggedIn && <button className='logoutButton' onClick={logoutHandler}>Logout</button>}
        </div>
        {isLoggedIn && premiumActivated && showThemeButtton && <button className='changeThemeButton' onClick={() => {dispatch(themeActions.changeTheme())}}>Change Theme</button>}
    </React.Fragment>
}

export default Header;