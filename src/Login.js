import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8800/login", values, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("authToken", res.data.token);
          login();
          //   console.log(token);
          navigate("/");
        } else {
          alert("No register user");
        }
      })
      .catch((err) => console.error("Error in axios request:", err));
  };
  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleInput}
          type="email"
          name="email"
          placeholder="enter email..."
        />
        <input
          onChange={handleInput}
          type="password"
          name="password"
          placeholder="enter password..."
        />
        <button type="submit">Login</button>
        <br /> <br />
        <p>
          Not registered? <Link to="/signup">signup</Link>
        </p>
      </form>
    </div>
  );
}
