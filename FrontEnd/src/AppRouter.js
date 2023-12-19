import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import React, { useState, useEffect } from "react";
import { checkMetaMaskInstalled, onConnect, clearState } from "./reduxModules";

import Home from "./component/Home/Home";
import Landing from "./component/Landing/Landing";
import Transfer from "./component/Transfer/Transfer";
import Claim from "./component/Claim/Claim";
import Refer from "./component/Refer/Refer";
import Transform from "./component/Transform/Transform";
import Stake from "./component/Stake/Stake";
import Redirect from "./component/Redirect/ReferalRedirection"
import { useSelector, useDispatch } from "react-redux";

function AppRouter(props) {
  const reduxState = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkMetaMaskInstalled())
    metamaskEventDetector()
  }, [reduxState.connection]);
  const metamaskEventDetector = async () => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', (accounts) => {
        if (!accounts.length) {
          // dispatch(clearState())
          window.location.reload();
        }
        else {
          dispatch(onConnect());
        }
      }
      )

    }
  }
  return (
    <>
      <Routes>
        <Route path="/app" exact element={<Transfer />} />
        <Route path="/" exact element={<Transfer />} />
        <Route path="/transfer" exact element={<Transfer />} />
        <Route path="/stake" exact element={<Stake />} />
        <Route path="/claim" exact element={<Claim />} />
        <Route path="/refer" exact element={<Refer />} />
        <Route path="/transform" exact element={<Transform />} />
        <Route path="/landing" exact element={<Landing />} />
        <Route path="/referalRedirection/:referAddress" exact element={<Redirect />} />
      </Routes>
    </>
  );
}

export default AppRouter;
