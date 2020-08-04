import React, { useState } from "react";
import styled from "styled-components";
import { NavBar } from "./NavBar/NavBar";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { MailProvider } from "./reducers/mail";
import { setupInterceptors } from "./utils";
import { useCookies } from "react-cookie";

const StyledNavBar = styled(NavBar)`
  grid-area: nav-bar;
`;

const StyledAppRouter = styled(AppRouter)`
  grid-area: content;
`;

export const UserContext = React.createContext<{
  loggedIn: boolean;
  setLoggedIn: any;
}>({
  loggedIn: false,
  setLoggedIn: () => false,
});

const App = styled(({ className }) => {
  const [cookies] = useCookies(["loggedIn"]);
  const [loggedIn, setLoggedIn] = useState<boolean>(!!cookies?.loggedIn);
  const [unreadUids, setUnreadUids] = useState<number[] | null>(null);
  setupInterceptors(setLoggedIn);

  return (
    <div className={className}>
      <BrowserRouter>
        <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
          <MailProvider>
            <StyledNavBar />
            <StyledAppRouter />
          </MailProvider>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
})`
  width: 100%;
  height: 100vh;

  display: grid;
  grid-template-columns: 4% auto;
  grid-template-rows: auto;
  grid-template-areas: "nav-bar content";
`;

export default App;
