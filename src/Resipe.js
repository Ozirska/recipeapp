import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Resipe = () => {
  const { recipes, setRecipes } = useAuth();

  // const [recipes, setRecipe] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:8800/recipe", {
          withCredentials: true,
        });
        isMounted && setRecipes(response.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    getRecipe();

    return () => {
      isMounted = false;
    };
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
              <img
                className="object-cover w-full h-[85%]"
                src={recipe.photo_url}
                alt={`Recipe ${i + 1}`}
              />
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
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <img
              className="w-px-48"
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
};

export default Resipe;
