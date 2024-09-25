import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import { useAuth } from "./AuthContext";
import Resipe from "./Resipe";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="mx-auto min-h-screen p-5 bg-gradient-to-b from-amber-50 via-cyan-100 to-fuchsia-100">
      <div className="flex justify-between items-center	 p-20px">
        <h1 className="text-black text-3xl m-5">Logo</h1>
        <div className="flex pt-2">
          {user && <h1 className="text-2xl font-medium mr-3">{user.name}</h1>}
          {isAuthenticated ? (
            <button
              className="text-[20px] font-medium mr-4"
              onClick={handleLogout}
            >
              / logout
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
      <br />{" "}
      {isAuthenticated ? (
        <Link
          to="/create"
          className="m-auto block w-24 text-center	bg-blue-50 hover:bg-blue-300 py-1  rounded"
          style={{
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          }}
        >
          CREATE
        </Link>
      ) : (
        ""
      )}
      <br />
      <br />{" "}
      {isAuthenticated ? (
        <Link
          to="/my_recipe"
          className="block w-24 text-center	 hover:bg-purple-200 py-1  rounded"
          style={{
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          }}
        >
          MY RECIPES
        </Link>
      ) : (
        ""
      )}
      <br />
      <br />
      {isAuthenticated ? (
        <Resipe />
      ) : (
        <div>
          <p className="text-center text-[35px] font-[400]">Join us!</p>
          <br />
          <p className="text-center">
            Here you can store your favorites recipes and watch other users
            recipes!
          </p>
        </div>
      )}
    </div>
  );
}
