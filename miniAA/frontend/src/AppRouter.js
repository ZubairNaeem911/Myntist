import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import React, { useState } from "react";
import FreePool from './components/FreePool';
import PointsPool from './components/PointsPool';



function AppRouter(props) {

  const [user, setUser] = useState(null);
  return (
    <>
    <Router >
        <Routes>
            <Route path="/freepool" exact element={<FreePool user={user} setUser={setUser}  />} />
            <Route path="/" exact element={<PointsPool user={user} setUser={setUser}  />} />
            <Route path="/pointspool" exact element={<PointsPool user={user} setUser={setUser} />} />

        </Routes>
      </Router>
    </>
  );
}

export default AppRouter;
