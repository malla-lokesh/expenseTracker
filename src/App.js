import React, { useEffect } from "react";
import AuthenticationForm from "./Components/Authentication/AuthenticationForm";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom/cjs/react-router-dom";
import Homepage from "./Pages/Homepage";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import ForgotPassword from "./Pages/ForgotPassword";
import ExpenseForm from "./Expenses/ExpenseForm";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./Store/AuthReducer";
import Header from "./Pages/Header";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.authentication.isLoggedIn);
  const idToken = useSelector(state => state.authentication.idToken);

  useEffect(() => {
    if(!idToken) {
      dispatch(authActions.logout());
    }
  }, [dispatch, idToken]);

  return (
    <React.Fragment>
      <Header/>
      <hr/>
      <Router>
        <Switch>
          <Route path='/' exact>
            {!isLoggedIn ? <AuthenticationForm/> : <Redirect to='/homepage'/>}
          </Route>
          <Route path='/homepage' exact>
            {isLoggedIn ? <Homepage/> : <Redirect to='/'/>}
          </Route>
          <Route path='/updateProfilePage'>
            {isLoggedIn ? <UpdateProfilePage/> : <Redirect to='/'/>}
          </Route>
          <Route path='/forgotpassword'>
            <ForgotPassword/>
          </Route>
          <Route path='/expenseForm'>
            {isLoggedIn ? <ExpenseForm/> : <Redirect to='/'/>}
          </Route>
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
