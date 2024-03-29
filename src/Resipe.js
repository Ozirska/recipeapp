import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import getResipeFunc from "./getResipeFunc";

const Resipe = () => {
  const { recipes, setRecipes } = useAuth();

  // const [recipes, setRecipe] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    getResipeFunc(setRecipes);
  }, [setRecipes]);

  const openModal = (info) => {
    setSelectedRecipe(info);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <article>
      <h2 className="px-5">Recipe List</h2>
      {recipes.length ? (
        <div className=" p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {recipes.map((recipe, i) => (
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
            <div className="w-[300px h-[300px]">
              <img
                className="object-cover w-full h-full"
                src={selectedRecipe.photo_url}
                alt="Recipe"
              />
            </div>
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
};

export default Resipe;
