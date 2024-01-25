import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
// import Users from "./Users";
import Resipe from "./Resipe";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post("http://localhost:8800/logout", {}, { withCredentials: true })
      .then((res) => {
        logout();
        navigate("/");
      })
      .catch((err) => {
        console.error("Error in axios request:", err);
      });
  };

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      {isAuthenticated ? <Link to="/create">create</Link> : ""}

      {!isAuthenticated ? <Link to="/login">login</Link> : ""}
      <br />
      {!isAuthenticated ? <Link to="/signup">signup</Link> : ""}
      <br />
      {isAuthenticated ? <button onClick={handleLogout}>logout</button> : ""}

      <br />
      <br />
      <br />
      {isAuthenticated ? <Resipe /> : ""}
    </div>
  );
}
