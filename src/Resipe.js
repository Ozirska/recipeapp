import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import getResipeFunc from "./getResipeFunc";
import SelectedRecipe from "./SelectedRecipe";

const Resipe = () => {
  const { recipes, setRecipes } = useAuth();

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
        <SelectedRecipe
          selectedRecipe={selectedRecipe}
          closeModal={closeModal}
        />
      )}
    </article>
  );
};

export default Resipe;
