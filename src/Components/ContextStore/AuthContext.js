import React, { useState } from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    setToken: (token, mail) => {}
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [email, setEmail] = useState(localStorage.getItem('email'));

    const isLoggedIn = !!token;

    const setTokenHandler = (token, mail) => {
        let mailId = mail.replace(/[.@]/g, "");
        setToken(token);
        setEmail(mailId);
        localStorage.setItem('token', token);
        localStorage.setItem('email', mailId);
    }

    const authContextValue = {
        token: token,
        email: email,
        isLoggedIn: isLoggedIn,
        setToken: setTokenHandler
    }

    return <AuthContext.Provider value={authContextValue}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;