import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useSelector } from "react-redux";

const Homepage = () => {
    const history = useHistory();
    const idToken = useSelector(state => state.authentication.idToken)

    const verfiyEmailHandler = () => {
        fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDbZODcPqKDtyrTyZl4UpkMuFUsMsfH9Aw`, {
            method: 'POST',
            body: JSON.stringify({
                requestType: 'VERIFY_EMAIL',
                idToken: idToken
            }),
            headers: {
                'Content-Type': 'application/json'
            }
            }).then(res => {
                if(res.ok) {
                    return res.json();
                } else {
                    res.json().then(data => alert(data.error.message))
                }
            })
    }

    return <React.Fragment>
        <div>
            <div>Want to update your profile?: 
                <button type='button' onClick={() => history.push('/updateProfilePage')}>Click here</button>
            </div>
        </div>
        <hr/>
        <div>
            <button type='button' onClick={verfiyEmailHandler}>
                Click here
            </button>
             to verify your email
        </div>
        <div>
            <button type='button' onClick={() => history.push('/expenseForm')}>
                Click here 
            </button>
            to explore your expenses
        </div>
    </React.Fragment>
};

export default Homepage;