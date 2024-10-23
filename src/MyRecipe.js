import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import getRecipesFunc from "./getResipeFunc";
import SelectedRecipe from "./SelectedRecipe";

export default function MyRecipe() {
  const {
    user,
    recipes,
    setRecipes,
    getUserDataToken,
    isAuthenticated,
    logout,
  } = useAuth();

  const [userRecipes, setUserRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getRecipesFunc(setRecipes);

    const userRecipes = recipes.filter((el) => user?.id === el.userID);
    setUserRecipes(userRecipes);
  }, [user?.id, recipes, setRecipes]);

  const openModal = (info) => {
    setSelectedRecipe(info);
  };
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const closeModal = () => {
    setSelectedRecipe(null);
  };

  const deleteRecipe = async (info) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/delete`,
        info
      );

      if (response.status === 200) {
        const updatedUserRecipes = userRecipes.filter(
          (recipe) => recipe.id !== info.id
        );
        setUserRecipes(updatedUserRecipes);

        getRecipesFunc(setRecipes);
        getUserDataToken();
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  return (
    <article>
      <div className="mx-auto min-h-screen p-5 bg-gradient-to-b from-amber-50 via-cyan-100 to-fuchsia-100">
        <div className="flex justify-between items-center	 p-20px">
          <h1 className="text-blue-600 text-3xl m-5">Logo</h1>

          <div className="flex">
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
            )}{" "}
          </div>
        </div>
        <br />
        <Link to="/" className="underline text-gray-500">
          <span>&#60;</span> back
        </Link>
        <h1 className=" text-center">Your Recipe List</h1>
        <br />
        {userRecipes.length ? (
          <div className=" p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {userRecipes.map((recipe, i) => (
              <div key={i}>
                <div className="w-[100px h-[180px]">
                  <img
                    className="object-cover w-full h-full"
                    src={recipe.photo_url}
                    alt={`Recipe ${i + 1}`}
                  />
                </div>
                <h1
                  className="text-center hover:cursor-pointer hover:text-violet-400 uppercase mt-2"
                  onClick={() => openModal(recipe)}
                >
                  {recipe.title}
                </h1>
                <button
                  className="m-auto block w-24 text-center	bg-red-50 hover:bg-red-300 py-1  rounded"
                  onClick={() => {
                    deleteRecipe(recipe);
                  }}
                >
                  delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="ml-3">
            <p>You don't have recipes.</p>
            <p>Would you like to crete?</p>
            <Link
              to="/create"
              className="m-2 block w-24 text-center	bg-blue-50 hover:bg-blue-300 py-1  rounded"
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
              }}
            >
              CREATE
            </Link>
          </div>
        )}
        {selectedRecipe && (
          <SelectedRecipe
            selectedRecipe={selectedRecipe}
            closeModal={closeModal}
          />
        )}
      </div>
    </article>
  );
}
