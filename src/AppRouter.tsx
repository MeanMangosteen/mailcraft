import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { Declutter } from "./Declutter/Declutter";
import { Analyse } from "./Analyse/Analyse";
import { OAuth } from "./OAuth";

const AppRouter = styled(() => {
  return (
    <Switch>
      <Route path="/declutter" component={Declutter} />
      <Route path="/analyse" component={Analyse} />
      <Route path="/OAuthSuccess" component={OAuth} />
    </Switch>
  );
})``;

export { AppRouter };
