import React, { useState, useContext } from "react";
import { ChooseVictim } from "./ChooseVictim";
import { Redirect, Route, useLocation, Switch } from "react-router-dom";
import { DestroyVictim } from "../MassDestruction/DestroyVictim";
import { Leftovers } from "../Leftovers/Leftovers";
import { UserContext } from "../App";

export const DeclutterRouter = () => {
  const [currStage, setCurrStage] = useState<"stage1" | "stage2">("stage1");
  const location = useLocation();
  const userCtx = useContext(UserContext);

  // Let's start of which just direct towards MD or leftovers
  let stageToDisplay;
  if (!userCtx.loggedIn) {
    stageToDisplay = (
      <Redirect
        to={{ pathname: "/login", state: { referrer: location.pathname } }}
      />
    );
  } else {
    switch (currStage) {
      case "stage1":
        /**
         * location.pathname = /declutter/mass-destruction
         * urlPieces = ["", "declutter", "mass-destruction"]
         */
        const urlPieces = location.pathname.split("/");
        stageToDisplay =
          urlPieces.length > 3 && urlPieces[2] === "mass-destruction" ? ( // Pre-existing path in the address bar. Use it.
            <Redirect to={location} />
          ) : (
            <Redirect
              key={location.pathname}
              to="/declutter/mass-destruction"
            />
          );
        break;
      case "stage2":
        stageToDisplay = (
          <Redirect key={location.pathname} to="/declutter/leftovers" />
        );
        break;
    }
  }

  return (
    <>
      {stageToDisplay}
      <Switch>
        <Route
          path="/declutter/mass-destruction/destroy"
          component={DestroyVictim}
        />
        <Route path="/declutter/mass-destruction">
          <Stage1 onComplete={() => setCurrStage("stage2")} />
        </Route>
        <Route path="/declutter/leftovers">
          <Stage2 />
        </Route>
      </Switch>
    </>
  );
};

const Stage1 = ({ onComplete }) => {
  return <ChooseVictim onComplete={onComplete} />;
};

const Stage2 = () => {
  return <Leftovers />;
};
