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
  const { mail, fetchMail, stage } = useMail();
  const handleGameTime = cb(() => setGameTime(true), []);

  useEffect(() => {
    fetchMail();
  }, [userCtx.loggedIn]);

  // useEffect(() => {
  //   if (!mail) return; // wait for mail fetch
  //   // get all the email senders
  //   const senders = mail.map((m) => m.envelope.from[0].address.split("@")[1]);
  //   // Tally the no. emails sent by each sender
  //   const count = {};
  //   senders.map((m) => {
  //     if (count[m]) {
  //       count[m]++;
  //     } else {
  //       count[m] = 1;
  //     }
  //   });

  //   // if all senders have a count of 3 or less move to the leftovers stage
  //   let massDestructionComplete = true;
  //   Object.values(count).forEach((count: any) => {
  //     if (count > 3) massDestructionComplete = false;
  //   });

  //   if (!mail.length) {
  //     // We've addressed all the mail
  //     setCurrStage("success!");
  //   } else if (massDestructionComplete) {
  //     setCurrStage("stage2");
  //   }
  // }, [mail]);

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
