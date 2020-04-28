import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import PieChart from "./PieChart";
import { UserContext } from "../App";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

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

  useEffect(() => {
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
      axios
        .get("http://localhost:4000/mail")
        .then((res) => {
          console.log(res);
          const senders = res.data.map(
            (m) => m.envelope.from[0].address.split("@")[1]
          );
          const count = {};
          senders.map((m) => {
            if (count[m]) {
              count[m]++;
            } else {
              count[m] = 1;
            }
          });
          const countSorted = Object.entries(count)
            .sort((a: any, b: any) => b[1] - a[1])
            .map(([sender, count]) => {
              return { id: sender, field: count };
            });
          setChartData({ table: countSorted.slice(0, 5) });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [cookies.logged_in]);

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

  return (
    <PageContainer>
      {!cookies.logged_in ? loginSubcomponent : <PieChart data={chartData} />}
    </PageContainer>
  );
})``;

export { Declutter };
