import React, { useState } from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    displayName: '',
    photoUrl: '',
    email: '',
    setToken: (token, mail) => {},
    setDisplayName: (displayName) => {},
    setPhotoUrl: () => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [displayName, setDisplayName] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const isLoggedIn = (token!=null) ? true : false;

    const setTokenHandler = (token, mail) => {
        let mailId = mail.replace(/[.@]/g, "");
        setToken(token);
        setEmail(mailId);
        localStorage.setItem('token', token);
        localStorage.setItem('email', mailId);
    }

    const logoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setToken(null);
        setEmail(null);
    }

    const authContextValue = {
        token: token,
        email: email,
        isLoggedIn: isLoggedIn,
        displayName: displayName,
        photoUrl: photoUrl,
        setToken: setTokenHandler,
        setDisplayName: (name) => {setDisplayName(name)},
        setPhotoUrl: (photo) => {setPhotoUrl(photo)},
        logout: logoutHandler
    }

    return <AuthContext.Provider value={authContextValue}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;