import React, { useContext, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import PieChart from "./PieChart";
import { UserContext } from "../App";
import axios from "axios";
import { useLocation, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useMail } from "../reducers/mail";
import { scale } from "vega";
import OauthPopup from "react-oauth-popup";
import Axios from "axios";

interface DeclutterProps {
  className?: string;
}

const LoginBackgroundCorona = styled.div`
  background: rgb(255, 179, 0);
  background: radial-gradient(
    circle,
    rgba(255, 179, 0, 0) 0%,
    rgba(255, 255, 255, 1) 95%
  );
  height: 100%;
  width: 100%;
`;
const LoginBackground = styled.div`
  background: radial-gradient(
    circle closest-side,
    rgba(106, 98, 255, 1) 0%,
    rgba(182, 36, 255, 1) 7%,
    rgba(255, 0, 121, 1) 31%,
    rgba(255, 179, 0, 1) 80%,
    rgba(255, 206, 89, 0.8239670868347339) 94%,
    rgba(255, 255, 255, 1) 100%
  );
  position: absolute;
  height: 100vw;
  width: 100vh;
  top: 0;
  left: 0;
  z-index: -1;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  /* background: red; */
  /* background: rgb(106, 98, 255); */
  /* background: radial-gradient(
    circle closest-side,
    rgba(106, 98, 255, 1) 0%,
    rgba(182, 36, 255, 1) 7%,
    rgba(255, 0, 121, 1) 31%,
    rgba(255, 179, 0, 1) 80%,
    rgba(255, 206, 89, 0.8239670868347339) 94%,
    rgba(255, 255, 255, 1) 100%
  );
  z-index: -1; */
  /* position: absolute; */
  /* This piece of maddness ensures we line up with the background */
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  /* top: 0; left: 0; */
`;

const LoginText = styled.h1`
  transform: none;
  color: #00ff97;
  mix-blend-mode: screen;
  text-shadow: 0 0 5px #9dbd1a;
  /* &:hover {
    color: black;
    background: blue;
  } */
  /* z-index: 100; */

  ${LoginContainer} {
    background: red;
  }
`;

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
  }
`;
const Declutter = styled(({ className = "declutter" }) => {
  const [cookies, setCookie] = useCookies();
  const [chartData, setChartData] = useState<any>(undefined);
  const [victim, setVictim] = useState<string | null>(null);
  const [missionSuccessful, setMissionSuccessful] = useState<boolean>(false);
  const { mail } = useMail();

  useEffect(() => {
    if (!mail) return;
    // get all the senders
    const senders = mail.map((m) => m.envelope.from[0].address.split("@")[1]);
    // {[sender]: [emails recieved by sender]}
    const count = {};
    senders.map((m) => {
      if (count[m]) {
        count[m]++;
      } else {
        count[m] = 1;
      }
    });
    // Sort and format data for pie chart
    const countSorted = Object.entries(count)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([sender, count]: [any, any]) => {
        return { id: sender, field: (count / mail.length) * 100 };
      });
    setChartData({ table: countSorted.slice(0, 5) });

    // if all senders have a count of 3 or less move to the next stage
    let success = true;
    Object.values(count).forEach((count: any) => {
      if (count > 3) success = false;
    });
    // for (let i = 0; i < Objeccount.length; i++) {
    //   if (count[i] > 3) {
    //     success = false;
    //     break;
    //   }
    // }
    if (success) {
      setMissionSuccessful(success);
    }
  }, [mail]);

  useEffect(() => {
    if (cookies.logged_in) {
    }
  }, [cookies.logged_in]);

  const pieData = {
    table: [
      { id: 1, field: 4 },
      { id: 2, field: 6 },
      { id: 3, field: 10 },
      { id: 4, field: 3 },
      { id: 5, field: 7 },
      { id: 6, field: 8 },
    ],
  };

  const handleClick = (name, leMagic) => {
    console.log(leMagic);
    setVictim(leMagic.id);
  };
  return (
    <PageContainer>
      {!cookies.logged_in ? (
        <Login />
      ) : (
        <PieChart
          data={chartData}
          signalListeners={{ click: handleClick, hover: handleClick }}
        />
      )}
      {victim ? (
        <Redirect to={`/declutter/mass_destruction?victim=${victim}`} />
      ) : null}
      {missionSuccessful && <Redirect to="/leftovers" />}
    </PageContainer>
  );
})``;

const Login = () => {
  const [oAuthUrl, setOAuthUrl] = useState(undefined);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const location = useLocation();
  const [cookies, setCookie] = useCookies();
  useEffect(() => {
    // if not logged in get oauth login url
    if (!cookies.logged_in) {
      setCookie("redirect", "/declutter");
      axios
        .get("http://localhost:4000/OAuthUrl", {
          params: { pathname: location.pathname },
        })
        .then((res) => {
          setOAuthUrl(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  }, [cookies.logged_in]);

  const handleClick = (event) => {
    event.preventDefault();
    setClicked(true);
  };

  const handleOAuthClose = () => {
    console.log("oauth close");
  };

  const handleOAuthCode = (code, params) => {
    console.log("oauth handle code");
    console.log(code, params);

    Axios.post("http://localhost:4000/OAuthConfirm", {
      code,
    })
      .then(() => {
        setCookie("logged_in", true);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };
  return (
    <LoginContainer>
      <GlobalStyle hovered={hovered} clicked={clicked} />
      <LoginText
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        <OauthPopup
          url={oAuthUrl}
          onCode={handleOAuthCode}
          onClose={handleOAuthClose}
        >
          <LoginLink href={oAuthUrl}>Log me in!</LoginLink>
        </OauthPopup>
        {/* <LoginBackground /> */}
      </LoginText>
    </LoginContainer>
  );
};

export { Declutter };
