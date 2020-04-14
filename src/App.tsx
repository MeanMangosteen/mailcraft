import React from "react";
import styled from "styled-components";
import { NavBar } from "./NavBar/NavBar";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";

const StyledNavBar = styled(NavBar)`
  grid-area: nav-bar;
`;

const StyledAppRouter = styled(AppRouter)`
  grid-area: content;
`;

export const UserContext = React.createContext(false);

const App = styled(({ className }) => {
  return (
    <div className={className}>
      <BrowserRouter>
        <UserContext.Provider value={false}>
          <StyledNavBar />
          <StyledAppRouter />
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
})`
  width: 100%;
  height: 100vh;

  display: grid;
  grid-template-columns: 6% auto;
  grid-template-rows: auto;
  grid-template-areas: "nav-bar content";
`;

export default App;
