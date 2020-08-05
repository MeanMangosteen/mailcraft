import React, { useContext, useEffect, useMemo } from "react";
import { Redirect, Route, useLocation, Switch } from "react-router-dom";
import { DestroyVictim } from "../MassDestruction/DestroyVictim";
import { UserContext } from "../App";
import { LoadingFeatFrank } from "../LoadingFeatFrank";
import { useMail } from "../reducers/mail";
import { Stage1, Stage2, Success } from "./Stages";

export const DeclutterRouter = () => {
  const location = useLocation();
  const userCtx = useContext(UserContext);
  const { fetchMail, stage, commitOps, isGameTime } = useMail();

  useEffect(() => {
    fetchMail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCtx.loggedIn]);

  useEffect(() => {
    if (stage !== "success!") return;

    commitOps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const stageToDisplay = useMemo(() => {
    if (!userCtx.loggedIn)
      return (
        <Redirect
          to={{ pathname: "/login", state: { referrer: location.pathname } }}
        />
      );
    if (!isGameTime) return <LoadingFeatFrank />;

    switch (stage) {
      case "mass destruction":
        /**
         * location.pathname = /declutter/mass-destruction
         * urlPieces = ["", "declutter", "mass-destruction"]
         */
        const urlPieces = location.pathname.split("/");
        return urlPieces.length > 3 && urlPieces[2] === "mass-destruction" ? ( // Pre-existing path in the address bar. Use it.
          <Redirect push to={location} />
        ) : (
          <Redirect push key={location.pathname} to="/declutter/mass-destruction" />
        );
      case "leftovers":
        return <Redirect push key={location.pathname} to="/declutter/leftovers" />;
      case "success!":
        return <Redirect push key={location.pathname} to="/declutter/success" />;
    }
  }, [userCtx.loggedIn, location, isGameTime, stage]);

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
      {isGameTime && routes}
    </>
  );
};
