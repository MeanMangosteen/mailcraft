import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { Declutter } from "./Declutter/Declutter";
import { Analyse } from "./Analyse/Analyse";
import { OAuth } from "./OAuth";
import { MassDestruction } from "./MassDestruction/MassDestruction";
import { Leftovers } from "./Leftovers";
import { Home } from "./Home/NewHome";
import { Playground } from "./Playground";
import { TwoLevelPieChart } from "./ChartPlayground";

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/declutter" component={Declutter} />
      <Route path="/declutter/mass_destruction" component={MassDestruction} />
      <Route path="/analyse" component={Analyse} />
      <Route path="/OAuthSuccess" component={OAuth} />
      <Route path="/leftovers" component={Leftovers} />
      <Route path="/play" component={TwoLevelPieChart} />
    </Switch>
  );
};
const TheRealDealContainer = styled.div`
  /* Allow content to scroll */
  overflow-y: scroll;
`;

export { AppRouter };
