import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const Homepage = () => {
    const history = useHistory();

    return <React.Fragment>
        <div>
            <div>Welcome to Expense Tracker!!!</div>
            <div>Want to update your profile?: 
                <button type='button' onClick={() => history.push('/updateProfilePage')}>Click here</button>
            </div>
        </div>
        <hr/>
    </React.Fragment>
};

export default Homepage;