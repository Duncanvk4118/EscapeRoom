import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router";

const root = document.getElementById("root");

const questId = window.location.pathname.split("/scan/")[1];

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<h1>Login into account</h1>} />
      <Route path="/create" element={<h1>Create a new account</h1>} />
      <Route path="/scan" element={<h1>Scan your QR code</h1>} />
      <Route
        path="/scan/:questId"
        element={<h1>Scan your QR code with ID: {questId}</h1>}
      />
      <Route
        path="/leaderboard"
        element={<h1>See which team is on the top</h1>}
      />
    </Routes>
  </BrowserRouter>
);
