import React, { useContext } from "react";
import AuthenticationForm from "./Components/AuthenticationForm";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom/cjs/react-router-dom";
import Homepage from "./Pages/Homepage";
import AuthContext from "./Components/ContextStore/AuthContext";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import ForgotPassword from "./Pages/ForgotPassword";
import ExpenseForm from "./Expenses/ExpenseForm";
import { ExpenseContextProvider } from "./Components/ExpenseStore/ExpenseContext";

function App() {
  const authContext = useContext(AuthContext);

  return (
    <React.Fragment>
      <ExpenseContextProvider>
        <Router>
          <Switch>
            <Route path='/' exact>
              <AuthenticationForm/>
            </Route>
            <Route path='/homepage' exact>
              {authContext.isLoggedIn ? <Homepage/> : <Redirect to='/'/>}
            </Route>
            <Route path='/updateProfilePage'>
              {authContext.isLoggedIn ? <UpdateProfilePage/> : <Redirect to='/'/>}
            </Route>
            <Route path='/forgotpassword'>
              <ForgotPassword/>
            </Route>
            <Route path='/expenseForm'>
              {authContext.isLoggedIn ? <ExpenseForm/> : <Redirect to='/'/>}
            </Route>
          </Switch>
        </Router>
      </ExpenseContextProvider>
    </React.Fragment>
  );
}

export default App;
