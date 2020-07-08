import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { ChooseVictim } from "./Declutter/ChooseVictim";
import { Analyse } from "./Analyse/Analyse";
import { OAuth } from "./OAuth";
import { Leftovers } from "./Leftovers/Leftovers";
import { Home } from "./Home/NewHome";
import { Playground } from "./Playground";
import { TwoLevelPieChart } from "./ChartPlayground";
import { DestroyVictim } from "./MassDestruction/DestroyVictim";
import { DeclutterRouter } from "./Declutter/DeclutterRouter";

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/declutter" component={DeclutterRouter} />

      <Route path="/analyse" component={Leftovers} />
      <Route path="/OAuthSuccess" component={OAuth} />
      <Route path="/play" component={TwoLevelPieChart} />
    </Switch>
  );
};
const TheRealDealContainer = styled.div`
  /* Allow content to scroll */
  overflow-y: scroll;
`;

export { AppRouter };
