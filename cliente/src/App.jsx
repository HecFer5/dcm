import "./App.css";
import { Route, Routes } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import './index.css'
import MovieList from "./componentes/principal"
import Home from "./componentes/home";

function App() {
  return (
    <>
      {/* <NavBar /> */}
      <Routes>
        {/* <Route path="/" element={<MovieList />} /> */}
        <Route path="/" element={<Home />} />


        </Routes>
    </>
  );
}

export default App;
