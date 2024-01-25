import { useState, useEffect } from "react";
import axios from "axios";

const Resipe = () => {
  const [recipes, setRecipe] = useState();

  useEffect(() => {
    let isMounted = true;

    const getRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:8800/recipe", {
          withCredentials: true,
        });
        console.log(response.data);
        isMounted && setRecipe(response.data);
      } catch (err) {}
    };
    getRecipe();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <article>
      <h2>Recipe List</h2>
      {recipes?.length ? (
        <ul>
          {recipes.map((recipe, i) => (
            <li key={i}>{recipe?.title}</li>
          ))}
        </ul>
      ) : (
        <p>No recipes</p>
      )}
    </article>
  );
};

export default Resipe;
