import React, { useState } from "react";
import styled from "styled-components";
import { NavBar } from "./NavBar/NavBar";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import { CookiesProvider } from "react-cookie";
import { MailProvider } from "./reducers/mail";

const StyledNavBar = styled(NavBar)`
  grid-area: nav-bar;
`;

const StyledAppRouter = styled(AppRouter)`
  grid-area: content;
`;

export const UserContext = React.createContext(false);
// OMGTODO: delete if not needed;
// export const MailContext: React.Context<{
//   mail: any;
//   setMail: (mail) => void;
// }> = React.createContext({ mail: null, setMail: (mail) => {} });

const App = styled(({ className }) => {
  // OMGTODO: delete if not needed;
  // const [mail, setMail] = useState(null);
  // const mailCtxInitial = { mail, setMail };

  return (
    <div className={className}>
      <BrowserRouter>
        <CookiesProvider>
          <MailProvider>
            <StyledNavBar />
            <StyledAppRouter />
          </MailProvider>
        </CookiesProvider>
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
