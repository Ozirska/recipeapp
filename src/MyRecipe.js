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
      <div className="mx-auto min-h-screen p-5 bg-gradient-to-b from-amber-50 via-cyan-100 to-fuchsia-100">
        <div className="flex justify-between items-center	 p-20px">
          <h1 className="text-blue-600 text-3xl m-5">Logo</h1>
          {user && <h1 className="text-2xl font-medium mr-3">{user.name}</h1>}
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
          <p>No recipes</p>
        )}
        {selectedRecipe && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex  justify-center z-50 bg-black bg-opacity-50 overflow-auto">
            <div className="relative top-[10px] z-50 grid grid-cols-1 lg:grid-cols-2 gap-6  bg-white p-8 max-w-[80%] mx-auto rounded-md shadow-lg overflow-y-auto">
              <span
                onClick={closeModal}
                className="absolute top-0 right-0 p-4 cursor-pointer text-gray-600"
              >
                &times;
              </span>
              <h1 className="lg:col-span-2 font-bold text-center uppercase">
                {selectedRecipe.title}
              </h1>

              <img
                className="object-cover w-full "
                src={selectedRecipe.photo_url}
                alt="Recipe"
              />
              <table className="mt-3  lg:ml-5">
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
              <div className="lg:col-span-2">
                <h3 className="mt-3 mb-1 font-bold">Description:</h3>
                <p>{selectedRecipe.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
