import axios from "axios";

const getRecipesFunc = async (setRecipes) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SERVER}/recipe`);
    setRecipes(response.data);
  } catch (err) {
    console.error("Error fetching recipes:", err);
  }
};

export default getRecipesFunc;
