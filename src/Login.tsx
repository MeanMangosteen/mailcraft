import React, { useEffect, useState, useContext } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import OauthPopup from "react-oauth-popup";
import styled, { createGlobalStyle } from "styled-components";
import { api } from "./utils";
import { UserContext } from "./App";

export const Login = () => {
  const [oAuthUrl, setOAuthUrl] = useState(undefined);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const userCtx = useContext(UserContext);

  const location = useLocation<{ referrer: any }>();
  const [cookies, setCookie] = useCookies();
  useEffect(() => {
    // if not logged in get oauth login url
    if (!userCtx.loggedIn) {
      api
        .get("/OAuthUrl")
        .then((res) => {
          setOAuthUrl(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  }, [userCtx.loggedIn]);

  const handleLoginClick = (event) => {
    event.preventDefault();
    setClicked(true);
  };

  const handleOAuthClose = () => {};

  const handleOAuthCode = (code, params) => {
    api
      .post("/OAuthConfirm", {
        code,
      })
      .then(() => {
        userCtx.setLoggedIn(true);
        // setCookie("logged_in", true, { path: "/" });
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <>
      {/* Redirect the user to where they came from, else redirect home */}
      {userCtx.loggedIn && <Redirect to={location?.state?.referrer || "/"} />}

      <LoginContainer>
        <GlobalStyle hovered={hovered} clicked={clicked} />
        <LoginText
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleLoginClick}
        >
          <OauthPopup
            url={oAuthUrl}
            onCode={handleOAuthCode}
            onClose={handleOAuthClose}
          >
            <LoginLink href={oAuthUrl}>Log me in!</LoginLink>
          </OauthPopup>
        </LoginText>
      </LoginContainer>
    </>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  /* This piece of maddness ensures we line up with the background */
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
`;

const LoginText = styled.h1`
  transform: none;
  color: #36f0e6;
  mix-blend-mode: screen;
  text-shadow: 0 0 5px #9dbd1a;

  ${LoginContainer} {
    background: red;
  }
`;

const LoginLink = styled.a`
  /* Remove formatting for links (purple visited color, underline) */
  color: inherit;
  text-decoration: inherit;
`;

const GlobalStyle = createGlobalStyle`
  body::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;

    background: radial-gradient(
      circle closest-side,
      rgba(106,98,255,1) 0%, rgba(182,36,255,1) 7%, rgba(255,0,121,1) 31%, rgba(255,179,0,1) 70%, rgba(255,206,89,0.8239670868347339) 86%, rgba(255,255,255,1) 100%);
    /* transform: scale(0); */
    opacity:  ${({ hovered, clicked }: { hovered: boolean; clicked }) =>
      clicked || hovered ? "1" : "0"};
    transform: ${({
      hovered,
      clicked,
    }: {
      hovered: boolean;
      clicked: boolean;
    }) => (clicked ? "scale(4)" : hovered ? "scale(1)" : "scale(0)")};
    transition: transform 0.2s ease-in, opacity 0.3s ease-in;
    will-change: transform;
  }
`;
