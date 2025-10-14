import React, {useState} from "react";
 import ReactDOM from "react-dom/client";
 import "./index.css";
 import App from "./App";
 import {BrowserRouter, Routes, Route, redirect, Navigate} from "react-router";
 import {Quest} from "./Pages/Question";
 import {Scanner} from "./Pages/Scanner";
 import {Maps} from "./Pages/Map";
 import {Leaderboard} from "./Pages/Leaderboard";
import {Login} from "./Pages/Admin/Login";
// import {Register} from "./Pages/Admin/Register";
import {CreateAssignment} from "./Pages/Admin/Assignments/CreateAssignment";

const user = null;

 const root = document.getElementById("root");

 const questId = window.location.pathname.split("/scan/")[1];

 ReactDOM.createRoot(root).render(
   <BrowserRouter>
     <Routes>
       <Route path="/" element={<App />} />
       <Route path="/map" element={<Maps />} />

       <Route path="admin">
        <Route path="login" element={<Login />} />
       </Route>
       {/*<Route path="/register" element={<Register />} />*/}
       <Route path="/assignments/create" element={<CreateAssignment />} />
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
