import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Store/AuthReducer";
import { themeActions } from "../Store/ThemeReducer";

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
        <h1 style={{
            color: theme === 'dark' ? 'white' : 'black',
            backgroundColor: theme === 'dark' ? 'black' : 'white'
        }}>Welcome to Expense Tracker!!!</h1>
        {isLoggedIn && <button onClick={logoutHandler}>Logout</button>}
        {isLoggedIn && premiumActivated && showThemeButtton && <button onClick={() => {dispatch(themeActions.changeTheme())}}>Change Theme</button>}
    </React.Fragment>
}

export default Header;