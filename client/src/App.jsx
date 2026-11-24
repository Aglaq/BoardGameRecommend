import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import Games from "./subpages/Games.jsx";
import Login from "./subpages/Login.jsx";
import Register from "./subpages/Register.jsx";
import Account from "./subpages/Account.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { URL } from "./config.js";
import * as jose from "jose";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));

  useEffect(() => {
    const verify_token = async () => {
      try {
        if (!token) {
          setIsLoggedIn(false);
        } else {
          axios.defaults.headers.common["Authorization"] = token;
          const response = await axios.post(`${URL}/users/verify_token`);
          return response.data.ok ? login(token) : logout();
        }
      } catch (error) {
        console.log(error);
      }
    };
    verify_token();
  }, [token]);

  const login = (token) => {
    let decodedToken = jose.decodeJwt(token);
    console.log(decodedToken);
    // composing a user object based on what data we included in our token (login controller - jwt.sign() first argument)
    let user = {
      email: decodedToken.userEmail,
    };
    localStorage.setItem("token", JSON.stringify(token));
    setIsLoggedIn(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} />
        <div id="main">
          <div className="mainpart">
            <Routes>
              <Route path="/" element={<Navigate to="/games" />} />;
              <Route path="/games" element={<Games />} />;
              <Route
                path="/login"
                element={
                  isLoggedIn ? (
                    <Navigate to="/account" />
                  ) : (
                    <Login login={login} />
                  )
                }
              />
              <Route
                path="/register"
                element={isLoggedIn ? <Navigate to="/account" /> : <Register />}
              />
              <Route
                path="/account"
                element={
                  !isLoggedIn ? (
                    <Navigate to="/" />
                  ) : (
                    <Account logout={logout} user={user} />
                  )
                }
              />
            </Routes>
          </div>
          <Sidebar />
        </div>
      </Router>
    </>
  );
}

export default App;
