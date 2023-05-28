import React from "react";
import AuthenticationForm from "./Components/AuthenticationForm";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom/cjs/react-router-dom";
import Homepage from "./Components/Homepage";

function App() {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path='/' exact>
            <AuthenticationForm/>
          </Route>
          <Route path='/homepage' exact>
            <Homepage/>
          </Route>
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
