import { useState, useEffect } from "react";
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

  // console.log("selected", selectedRecipe);
  // console.log("recipes", recipes);

  return (
    <article>
      <h2 className="px-5">Recipe List</h2>
      {recipes.length ? (
        <div className=" p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {recipes.map((recipe, i) => (
            <div key={i}>
              <div
                className="w-[100px h-[180px] hover:cursor-pointer"
                onClick={() => openModal(recipe)}
              >
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
              className="absolute top-0 right-0 px-4 cursor-pointer text-gray-600 text-[25px]"
            >
              &times;
            </span>
            <div className="w-[300px h-[300px] mb-4">
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
                {selectedRecipe.ingredients &&
                  JSON.parse(selectedRecipe.ingredients).map((el, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td>{el.name}</td>
                      <td>{el.quantity}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <h3 className="mt-4 text-left text-2xs font-semibold">
              How to cook
            </h3>
            <p>{selectedRecipe.description}</p>
          </div>
        </div>
      )}
    </article>
  );
};

export default Resipe;
