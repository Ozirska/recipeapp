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
      <div className="flex justify-between items-center	 p-20px">
        <h1 className="text-blue-600 text-3xl">Logo</h1>
        <div className="flex pt-2">
          {user && <h1>{user.name}</h1>}
          {isAuthenticated ? (
            <button
              className="block w-24 mr-4 text-center	 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1  rounded"
              onClick={handleLogout}
            >
              logout
            </button>
          ) : (
            ""
          )}
          {!isAuthenticated ? (
            <Link
              className="block w-24 mr-4 text-center	 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1  rounded"
              to="/login"
            >
              login
            </Link>
          ) : (
            ""
          )}
          {!isAuthenticated ? (
            <Link
              className=" block w-24 text-center	 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 rounded"
              to="/signup"
            >
              signup
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <br /> {isAuthenticated ? <Link to="/create">create</Link> : ""}
      <br />
      <br />
      <br />
      <Resipe />
    </div>
  );
}
