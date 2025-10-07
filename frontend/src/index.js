import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Quest } from "./Pages/Question";
import { Scanner } from "./Pages/Scanner";
import { Register } from "./Pages/Register";
import { Login } from "./Pages/Login";
import { Leaderboard } from "./Pages/Leaderboard";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<Register />} />
      <Route path="/scan" element={<Scanner />} />
      <Route path="/scan/:questId" element={<Quest />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  </BrowserRouter>
);
