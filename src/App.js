import React, { useContext } from "react";
import AuthenticationForm from "./Components/AuthenticationForm";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom/cjs/react-router-dom";
import Homepage from "./Pages/Homepage";
import AuthContext from "./Components/ContextStore/AuthContext";
import UpdateProfilePage from "./Pages/UpdateProfilePage";

function App() {
  const authContext = useContext(AuthContext);

  return (
    <React.Fragment>
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
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
