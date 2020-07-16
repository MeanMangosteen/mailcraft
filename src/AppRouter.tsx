import React from "react";
import { Switch, Route } from "react-router-dom";
import { OAuth } from "./OAuth";
import { Leftovers } from "./Leftovers/Leftovers";
import { Home } from "./Home/NewHome";
import { Playground } from "./Playground";
import { TwoLevelPieChart } from "./ChartPlayground";
import { DeclutterRouter } from "./Declutter/DeclutterRouter";
import { Login } from "./Login";
import { Insights } from "./Insights";

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/declutter" component={DeclutterRouter} />

      <Route path="/insights" component={Insights} />
      <Route path="/login" component={Login} />
      <Route path="/analyse" component={Leftovers} />
      <Route path="/OAuthSuccess" component={OAuth} />
      <Route path="/play" component={TwoLevelPieChart} />
    </Switch>
  );
};

export { AppRouter };
