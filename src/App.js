import React, { useEffect } from "react";
import AuthenticationForm from "./Components/Authentication/AuthenticationForm";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom/cjs/react-router-dom";
import Homepage from "./Pages/Homepage";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import ForgotPassword from "./Pages/ForgotPassword";
import ExpenseForm from "./Expenses/ExpenseForm";
import { ExpenseContextProvider } from "./Components/ExpenseStore/ExpenseContext";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./Components/Store/AuthReducer";

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
      <ExpenseContextProvider>
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
      </ExpenseContextProvider>
    </React.Fragment>
  );
}

export default App;
