import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const getUserDataToken = async () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken && storedToken !== "undefined") {
      const userIDFromToken = decodeToken(storedToken);
      axios
        .get(`${process.env.REACT_APP_SERVER}/auth?id=${userIDFromToken.id}`)
        .then((res) => {
          setUser(res.data);
          setIsAuthenticated(true);
        });
    }
  };

  useEffect(() => {
    getUserDataToken();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");

    setUser(null);
    setIsAuthenticated(false);
  };

  const setUserData = (data) => {
    setUser(data);
    setIsAuthenticated(true);
  };

  // Function to delete a cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setUserData,
        logout,
        recipes,
        setRecipes,
        getUserDataToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// Function to decode the token
const decodeToken = (token) => {
  try {
    const decodedData = atob(token.split(".")[1]);
    return JSON.parse(decodedData);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
