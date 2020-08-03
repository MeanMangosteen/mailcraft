import React, { useState, useContext, useEffect, useMemo } from "react";
import { Redirect, Route, useLocation, Switch } from "react-router-dom";
import { DestroyVictim } from "../MassDestruction/DestroyVictim";
import { UserContext } from "../App";
import { cb, useEffectDebugger } from "../utils";
import { LoadingFeatJohnty } from "../LoadingFeatJohnty";
import { useMail } from "../reducers/mail";
import { Stage1, Stage2, Success } from "./Stages";

export const DeclutterRouter = () => {
  // const [currStage, setCurrStage] = useState<"stage1" | "stage2" | "success!">(
  //   "stage1"
  // );
  const [gameTime, setGameTime] = useState<boolean>(false);
  const location = useLocation();
  const userCtx = useContext(UserContext);
  const { mail, fetchMail, stage, commitOps } = useMail();
  const handleGameTime = cb(() => setGameTime(true), []);

  useEffect(() => {
    fetchMail();
  }, [userCtx.loggedIn]);

  useEffect(() => {
    if (stage !== "success!") return;

    commitOps();
  }, [stage]);

  const stageToDisplay = useMemo(() => {
    if (!userCtx.loggedIn)
      return (
        <Redirect
          to={{ pathname: "/login", state: { referrer: location.pathname } }}
        />
      );
    if (!gameTime) return <LoadingFeatJohnty onGameTime={handleGameTime} />;

    switch (stage) {
      case "mass destruction":
        /**
         * location.pathname = /declutter/mass-destruction
         * urlPieces = ["", "declutter", "mass-destruction"]
         */
        const urlPieces = location.pathname.split("/");
        return urlPieces.length > 3 && urlPieces[2] === "mass-destruction" ? ( // Pre-existing path in the address bar. Use it.
          <Redirect to={location} />
        ) : (
          <Redirect key={location.pathname} to="/declutter/mass-destruction" />
        );
      case "leftovers":
        return <Redirect key={location.pathname} to="/declutter/leftovers" />;
      case "success!":
        return <Redirect key={location.pathname} to="/declutter/success" />;
    }
  }, [gameTime, location, userCtx.loggedIn, stage]);

  const routes = useMemo(
    () => (
      <Switch>
        <Route
          path="/declutter/mass-destruction/destroy"
          component={DestroyVictim}
        />
        <Route path="/declutter/mass-destruction">
          <Stage1 />
        </Route>
        <Route path="/declutter/leftovers">
          <Stage2 />
        </Route>
        <Route path="/declutter/success">
          <Success />
        </Route>
      </Switch>
    ),
    []
  );

  return (
    <>
      {stageToDisplay}
      {mail && routes}
    </>
  );
};
