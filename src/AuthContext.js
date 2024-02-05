import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const getUserDataToken = () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken && storedToken !== "undefined") {
      const userIDFromToken = decodeToken(storedToken);
      axios
        .get(
          `http://localhost:8800/auth?id=${userIDFromToken.id}`,

          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setUser(res.data[0]);
          setIsAuthenticated(true);
        });
    }
  };

  useEffect(() => {
    getUserDataToken();
  }, []);

  const login = () => {
    getUserDataToken();
  };

  const logout = () => {
    deleteCookie("jwt");

    localStorage.removeItem("authToken");

    setUser(null);
    setIsAuthenticated(false);
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
        login,
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
