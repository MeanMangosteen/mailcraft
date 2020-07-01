import React, { useContext, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import PieChart from "./PieChart";
import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useMail } from "../reducers/mail";
import { Login } from "../Login";

interface DeclutterProps {
  className?: string;
}

const Declutter = ({ className = "declutter" }) => {
  const [cookies, setCookie] = useCookies();
  const [chartData, setChartData] = useState<any>(undefined);
  const [victim, setVictim] = useState<string | null>(null);
  const [missionSuccessful, setMissionSuccessful] = useState<boolean>(false);
  const { mail } = useMail();

  useEffect(() => {
    if (!mail) return; // wait for mail fetch
    // get all the email senders
    const senders = mail.map((m) => m.envelope.from[0].address.split("@")[1]);
    // Tally the no. emails sent by each sender
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

    // if all senders have a count of 3 or less move to the leftovers stage
    let success = true;
    Object.values(count).forEach((count: any) => {
      if (count > 3) success = false;
    });
    if (success) {
      setMissionSuccessful(success);
    }
  }, [mail]);

  const handlePieClick = (name, leMagic) => {
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
          signalListeners={{ click: handlePieClick, hover: handlePieClick }}
        />
      )}
      {victim ? (
        <Redirect to={`/declutter/mass_destruction?victim=${victim}`} />
      ) : null}
      {missionSuccessful && <Redirect to="/leftovers" />}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export { Declutter };
