import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <header>
        <h1>Porikalan Computer Institute</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <footer>
        <p>© 2025 Porikalan Computer Institute - Jorhat, Assam</p>
      </footer>
    </>
  );
}

export default App;
