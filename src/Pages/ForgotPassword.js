import React, { useState } from "react"

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const passwordResetHandler = (event) => {
        event.preventDefault();

        setIsLoading(true);
        fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDbZODcPqKDtyrTyZl4UpkMuFUsMsfH9Aw`, {
            method: 'POST',
            body: JSON.stringify({
                requestType: 'PASSWORD_RESET',
                email: email
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.ok) {
                setEmail('');
                setLoaded(true);
                setIsLoading(false);
                return res.json();
            } else {
                res.json().then(data => console.log(data.error.message))
            }
        })
    }

    return <React.Fragment>
        <div>Enter the email with which you have registered</div>
        <form onSubmit={passwordResetHandler}>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter email address to get the password reset link'/>
            <button type='submit'>Send Link</button>
        </form>
        {isLoading ? 'Loading...' : null}
        {loaded ? 'Sent Password Reset Link to your mail!' : null}
    </React.Fragment>
};

export default ForgotPassword;