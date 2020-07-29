import React, { useState, useContext, useEffect, useMemo } from "react";
import { Redirect, Route, useLocation, Switch } from "react-router-dom";
import { DestroyVictim } from "../MassDestruction/DestroyVictim";
import { UserContext } from "../App";
import { cb, useEffectDebugger } from "../utils";
import { Loading } from "../Loading";
import { useMail } from "../reducers/mail";
import { Stage1, Stage2, Success } from "./Stages";

export const DeclutterRouter = () => {
  const [currStage, setCurrStage] = useState<"stage1" | "stage2" | "success!">(
    "stage1"
  );
  const [gameTime, setGameTime] = useState<boolean>(false);
  const location = useLocation();
  const userCtx = useContext(UserContext);
  const { mail, fetchMail } = useMail();
  const handleGameTime = cb(() => setGameTime(true), []);

  useEffect(() => {
    fetchMail();
  }, []);

  useEffect(() => {
    if (!mail) return; // wait for mail fetch
    // get all the email senders
    const senders = mail.map((m) => m.envelope.from[0].address.split("@")[1]);
    // Tally the no. emails sent by each sender
    const count = {};
    senders.map((m) => {
      if (count[m]) {
        count[m]++;
      } else {
        count[m] = 1;
      }
    });

    // if all senders have a count of 3 or less move to the leftovers stage
    let massDestructionComplete = true;
    Object.values(count).forEach((count: any) => {
      if (count > 3) massDestructionComplete = false;
    });

    if (!mail.length) {
      // We've addressed all the mail
      setCurrStage("success!");
    } else if (massDestructionComplete) {
      setCurrStage("stage2");
    }
  }, [mail]);

  // Let's start of which just direct towards MD or leftovers
  useEffectDebugger(() => {
    console.log("Just being useless");
  }, [currStage, gameTime, location, userCtx.loggedIn]);

  const stageToDisplay = useMemo(() => {
    if (!userCtx.loggedIn) {
      return (
        <Redirect
          to={{ pathname: "/login", state: { referrer: location.pathname } }}
        />
      );
    } else if (!gameTime) {
      return <Loading onGameTime={handleGameTime} />;
    } else {
      switch (currStage) {
        case "stage1":
          /**
           * location.pathname = /declutter/mass-destruction
           * urlPieces = ["", "declutter", "mass-destruction"]
           */
          const urlPieces = location.pathname.split("/");
          return urlPieces.length > 3 && urlPieces[2] === "mass-destruction" ? ( // Pre-existing path in the address bar. Use it.
            <Redirect to={location} />
          ) : (
            <Redirect
              key={location.pathname}
              to="/declutter/mass-destruction"
            />
          );
        case "stage2":
          return <Redirect key={location.pathname} to="/declutter/leftovers" />;
        case "success!":
          return <Redirect key={location.pathname} to="/declutter/success" />;
      }
    }
  }, [currStage, gameTime, location, userCtx.loggedIn]);

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
