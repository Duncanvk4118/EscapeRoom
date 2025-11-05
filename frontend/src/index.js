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
import EscapeRoomsList from "./Pages/Admin/EscapeRoomsList";
import EscapeRoomEditor from "./Pages/Admin/EscapeRoomEditor";
import QuestionsList from "./Pages/Admin/QuestionsList";
import QuestionEditor from "./Pages/Admin/QuestionEditor";
import RequireAdmin from "./Components/RequireAdmin";
import SessionsList from "./Pages/Admin/SessionsList";
import SessionDetail from "./Pages/Admin/SessionDetail";
import TeamDetail from "./Pages/Admin/TeamDetail";
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
                   <Route path="admin" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
                    <Route path="admin/login" element={<LoginPage />} />
                   <Route path="admin/escape-rooms" element={<RequireAdmin><EscapeRoomsList /></RequireAdmin>} />
                   <Route path="admin/escape-rooms/:id" element={<RequireAdmin><EscapeRoomEditor /></RequireAdmin>} />
                   <Route path="admin/questions" element={<RequireAdmin><QuestionsList /></RequireAdmin>} />
                   <Route path="admin/questions/new" element={<RequireAdmin><QuestionEditor /></RequireAdmin>} />
                   <Route path="admin/questions/:id" element={<RequireAdmin><QuestionEditor /></RequireAdmin>} />
                  <Route path="admin/sessions" element={<RequireAdmin><SessionsList /></RequireAdmin>} />
                  <Route path="admin/sessions/:id" element={<RequireAdmin><SessionDetail /></RequireAdmin>} />
                  <Route path="admin/sessions/:sessionId/teams/:teamId" element={<RequireAdmin><TeamDetail /></RequireAdmin>} />
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
