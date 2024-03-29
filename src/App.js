import "./App.css";
import "./tailwind.css";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Home from "./Home";
import MyRecipe from "./MyRecipe";
import CreateRecipe from "./CreateResipe";
import { useAuth } from "./AuthContext";

function App() {
  const { user, login, logout } = useAuth();

  return (
    <BrowserRouter className="App">
      <Routes>
        <Route path="/" element={<Home user={user} />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/create" element={<CreateRecipe user={user} />} />
        <Route path="/my_recipe" element={<MyRecipe user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
