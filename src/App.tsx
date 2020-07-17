import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavBar } from "./NavBar/NavBar";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { CookiesProvider, useCookies } from "react-cookie";
import { MailProvider } from "./reducers/mail";
import * as types from "styled-components/cssprop";
import { createBrowserHistory } from "history";
import { api, setupInterceptors } from "./utils";

const StyledNavBar = styled(NavBar)`
  grid-area: nav-bar;
`;

const StyledAppRouter = styled(AppRouter)`
  grid-area: content;
`;

// Used by axios interceptors
export const history = createBrowserHistory();

export const UserContext = React.createContext<{
  loggedIn: boolean;
  setLoggedIn: any;
}>({
  loggedIn: false,
  setLoggedIn: () => false,
});
// OMGTODO: delete if not needed;
// export const MailContext: React.Context<{
//   mail: any;
//   setMail: (mail) => void;
// }> = React.createContext({ mail: null, setMail: (mail) => {} });

const App = styled(({ className }) => {
  // OMGTODO: delete if not needed;
  // const [mail, setMail] = useState(null);
  // const mailCtxInitial = { mail, setMail };
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

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
