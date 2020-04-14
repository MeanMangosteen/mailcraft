import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import PieChart from "./PieChart";
import { UserContext } from "../App";
import axios from "axios";

interface DeclutterProps {
  className?: string;
}

const LoginContainer = styled.div``;
const LoginText = styled.h1``;
const LoginLink = styled.a`
  /* Remove formatting for links (purple visited color, underline) */
  color: inherit;
  text-decoration: inherit;
`;
// const LoginLogo = styled();
const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Declutter = styled(({ className = "declutter" }) => {
  const loggedIn = useContext(UserContext);
  const [oAuthUrl, setOAuthUrl] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loggedIn) {
      axios
        .get("http://localhost:4000/OAuthUrl")
        .then((res) => {
          setOAuthUrl(res.data);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
        });
    }
  }, []);

  const loginSubcomponent = (
    <LoginContainer>
      <LoginText>
        <LoginLink href={oAuthUrl}>Log me in!</LoginLink>
      </LoginText>
    </LoginContainer>
  );

  return (
    <PageContainer>
      {!loggedIn ? loginSubcomponent : null}
      {/* // <PieChart /> */}
    </PageContainer>
  );
})``;

export { Declutter };
