import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router";
import {Quest} from "./Pages/Question";
import {Scanner} from "./Pages/Scanner";
import {Register} from "./Pages/Register";
import {Login} from "./Pages/Login";
import {Leaderboard} from "./Pages/Leaderboard";

const root = document.getElementById("root");

const questId = window.location.pathname.split("/scan/")[1];

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create" element={<Register />} />
      <Route path="/scan" element={<Scanner />} />
      <Route
        path="/scan/:questId"
        element={<Quest questId={questId} />}
      />
      <Route
        path="/leaderboard"
        element={<Leaderboard />}
      />
    </Routes>
  </BrowserRouter>
);
