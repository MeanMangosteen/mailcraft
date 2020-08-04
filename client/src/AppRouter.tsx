import React from "react";
import { Switch, Route } from "react-router-dom";
import { Leftovers } from "./Leftovers/Leftovers";
import { Home } from "./Home/Home";
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
    </Switch>
  );
};

export { AppRouter };
