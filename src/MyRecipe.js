import React from "react";
import { useAuth } from "./AuthContext";

export default function MyRecipe() {
  const { user, logout, isAuthenticated } = useAuth();

  return <div>{user.name}</div>;
}
