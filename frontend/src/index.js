import React, {useState} from "react";
 import ReactDOM from "react-dom/client";
 import "./index.css";
 import App from "./App";
 import {BrowserRouter, Routes, Route, redirect, Navigate} from "react-router";
 import {Quest} from "./Pages/Question";
 import {Scanner} from "./Pages/Scanner";
 import {Maps} from "./Pages/Map";
 import {Leaderboard} from "./Pages/Leaderboard";
import {LoginPage} from "./Pages/Admin/Login";
// import {Register} from "./Pages/Admin/Register";
import {CreateAssignment} from "./Pages/Admin/Assignments/CreateAssignment";
import {LoginStudent} from "./Pages/Login";
import {Dashboard} from "./Pages/Admin/Dashboard";
import {AuthProvider} from "./Context/UserContext";
import {TeamProvider} from "./Context/TeamContext";


 const root = document.getElementById("root");

 ReactDOM.createRoot(root).render(
   <BrowserRouter>
       <AuthProvider>
           <TeamProvider>
             <Routes>
                 <Route path="/" element={<App />} >
                   <Route path="/map" element={<Maps />} />
                     <Route path="/login" element={<LoginStudent />} />

                   <Route path="admin" element={<Dashboard />} />
                      <Route path="admin/login" element={<LoginPage />} />
                   {/*<Route path="/register" element={<Register />} />*/}
                   <Route path="/assignments/create" element={<CreateAssignment />} />
                   <Route path="/scan" element={<Scanner />} />
                   <Route
                     path="/quest"
                     element={<Quest token={null} />}
                   />
                     <Route
                     path="/quest/:token"
                     element={<Quest token={":token"} />}
                   />
                   <Route
                     path="/leaderboard"
                     element={<Leaderboard />}
                   />
                 </Route>
             </Routes>
           </TeamProvider>
       </AuthProvider>
   </BrowserRouter>
 );
