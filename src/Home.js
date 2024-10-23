import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <header className="flex justify-between items-center p-20px">
        <h1 className="text-blue-600 text-3xl m-5">Logo</h1>
        <div className="flex pt-2">
          {isAuthenticated ? (
            <div className="flex items-center">
              {user.name && (
                <h1 className="text-2xl font-medium mr-3">{user.name}</h1>
              )}
              <button
                className="text-[20px] font-medium mr-4"
                onClick={handleLogout}
              >
                / logout
              </button>
            </div>
          ) : (
            <div className="flex pt-2">
              <Link
                className="block w-24 mr-4 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 rounded"
                to="/login"
              >
                login
              </Link>
              <Link
                className="block w-24 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 rounded"
                to="/signup"
              >
                signup
              </Link>
            </div>
          )}
        </div>
      </header>

      <main>
        {isAuthenticated ? (
          <div className="text-center">
            <Link
              to="/create"
              className="block w-24 m-auto text-center bg-blue-50 hover:bg-blue-300 py-1 rounded mb-4"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
              }}
            >
              CREATE
            </Link>

            <Link
              to="/my_recipe"
              className="block w-24 m-auto text-center hover:bg-purple-200 py-1 rounded"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
              }}
            >
              MY RECIPES
            </Link>

            <br />
            <br />
            <Resipe />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-[35px] font-[400]">Join us!</p>
            <p>
              Here you can store your favorite recipes and view other users'
              recipes!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
