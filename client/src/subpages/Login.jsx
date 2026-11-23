import { useState } from "react";
import axios from "axios";
import { URL } from "../config";
import { useNavigate, NavLink } from "react-router";
import * as jose from "jose";

const Login = (props) => {
  const [form, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setValues({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URL}/users/login`, {
        email: form.email.toLowerCase(),
        password: form.password,
      });
      setMessage(response.data.message);
      if (response.data.ok) {
        // here after login was successful we extract the email passed from the server inside the token
        let decodedToken = jose.decodeJwt(response.data.token);
        // and now we now which user is logged in in the client so we can manipulate it as we want, like fetching data for it or we can pass the user role -- admin or not -- and act accordingly, etc...
        console.log(
          "Email extracted from the JWT token after login: ",
          decodedToken.userEmail,
        );
        setTimeout(() => {
          props.login(response.data.token, response.data.user);
          navigate("/account");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>Log In</h1>
      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="form_container"
      >
        <p>
          Doesn't have an account? <NavLink to={"/register"}>Sign Up</NavLink>
        </p>
        <label>Email</label>
        <input name="email" />
        <label>Password</label>
        <input name="password" />
        <button>Log In</button>
        <div className="message">
          <h4>{message}</h4>
        </div>
      </form>
    </>
  );
};

export default Login;
