import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import PieChart from "./PieChart";
import { UserContext } from "../App";
import axios from "axios";
import { useLocation, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useMail } from "../reducers/mail";

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
  const [oAuthUrl, setOAuthUrl] = useState(undefined);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [cookies, setCookie] = useCookies();
  const [chartData, setChartData] = useState<any>(undefined);
  const [victim, setVictim] = useState<string | null>(null);
  const [missionSuccessful, setMissionSuccessful] = useState<boolean>(false);
  const { mail } = useMail();

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
          setError(err);
        });
    } else {
    }
  }, [cookies.logged_in]);

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

  const loginSubcomponent = (
    <LoginContainer>
      <LoginText>
        <LoginLink href={oAuthUrl}>Log me in!</LoginLink>
      </LoginText>
    </LoginContainer>
  );

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
        loginSubcomponent
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

export { Declutter };
