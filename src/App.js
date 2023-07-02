import React, { useEffect } from "react";
import AuthenticationForm from "./Components/Authentication/AuthenticationForm";
import { useNavigate, Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import ForgotPassword from "./Pages/ForgotPassword";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./Store/AuthReducer";
import Header from "./Pages/Header";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.authentication.isLoggedIn);
  const idToken = useSelector((state) => state.authentication.idToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (!idToken) {
      dispatch(authActions.logout());
    }
  }, [dispatch, idToken]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <React.Fragment>
      {isLoggedIn && <Header />}
      <Routes>
        <Route path="/" element={!isLoggedIn ? <AuthenticationForm/> : <Homepage/>}/>
        <Route path="/updateProfilePage" element={isLoggedIn ? <UpdateProfilePage /> : <Homepage />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
