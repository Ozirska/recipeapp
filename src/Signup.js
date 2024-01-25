import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";

export default function Signup() {
  const { login } = useAuth();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:8800/signup", values, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("authToken", res.data.token);
          login(res.data);
          console.log(res.data.token);
          navigate("/");
        } else {
          alert("No register user");
        }
      })
      .catch((err) => console.error("Error in axios request:", err));
  };
  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleInput}
          type="text"
          name="name"
          placeholder="enter name..."
        />
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
        <button type="submit">Signup</button>
        <br /> <br />
        <p>
          Already registered? <Link to="/login">register</Link>
        </p>
      </form>
    </div>
  );
}
