// api.js

import axios from "axios";
import { useAuth } from "./AuthContext";

const getRecipesFunc = async (setRecipes) => {
  try {
    const response = await axios.get(
      "https://recipeapp-server.vercel.app/recipe",
      {
        withCredentials: true,
      }
    );
    setRecipes(response.data);
  } catch (err) {
    console.error("Error fetching recipes:", err);
  }
};

export default getRecipesFunc;
