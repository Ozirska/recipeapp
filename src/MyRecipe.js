import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import getRecipesFunc from "./getResipeFunc";

export default function MyRecipe() {
  const { user, recipes, setRecipes, getUserDataToken } = useAuth();

  const [userRecipes, setUserRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    getRecipesFunc(setRecipes);

    const userRecipes = recipes.filter((el) => user?.id === el.userID);
    setUserRecipes(userRecipes);
  }, [user?.id]);

  const openModal = (info) => {
    setSelectedRecipe(info);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  const deleteRecipe = async (info) => {
    console.log(info);
    try {
      const response = await axios.post("http://localhost:8800/delete", info, {
        withCredentials: true,
      });

      if (response.status === 200) {
        getRecipesFunc(setRecipes);
        getUserDataToken();
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  return (
    <article>
      <h2 className="px-5">Recipe List</h2>
      <br />
      <Link to="/" className="underline text-gray-500">
        <span>&#60;</span> back
      </Link>
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
              <h1 className="text-center" onClick={() => openModal(recipe)}>
                {recipe.title}
              </h1>
              <button
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
        <p>No recipes</p>
      )}

      {selectedRecipe && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative z-50 bg-white p-8 max-w-md mx-auto rounded-md shadow-lg">
            <span
              onClick={closeModal}
              className="absolute top-0 right-0 p-4 cursor-pointer text-gray-600"
            >
              &times;
            </span>
            <img
              className="object-cover w-full h-40 md:h-48 lg:h-56"
              src={selectedRecipe.photo_url}
              alt="Recipe"
            />
            <table>
              <thead>
                <tr>
                  <th colSpan="2">Ingredients</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecipe.ingredients.map((el, index) => (
                  <tr key={index}>
                    <td>{el.name}</td>
                    <td>{el.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>{selectedRecipe.description}</p>
          </div>
        </div>
      )}
    </article>
  );
}
