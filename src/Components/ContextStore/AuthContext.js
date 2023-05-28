import React, { useState } from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    displayName: '',
    photoUrl: '',
    setToken: (token, mail) => {},
    setDisplayName: (displayName) => {},
    setPhotoUrl: () => {}
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

    const authContextValue = {
        token: token,
        email: email,
        isLoggedIn: isLoggedIn,
        displayName: displayName,
        photoUrl: photoUrl,
        setToken: setTokenHandler,
        setDisplayName: (name) => {setDisplayName(name)},
        setPhotoUrl: (photo) => {setPhotoUrl(photo)}
    }

    return <AuthContext.Provider value={authContextValue}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;