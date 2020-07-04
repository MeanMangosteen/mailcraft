import React, { useContext, useEffect, useState, Fragment } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
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
  const { mail, info } = useMail();

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
        return {
          id: sender,
          field: Math.round((count / mail.length) * 100),
        };
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
        // TODO: this should redirect to login rather than render it.
        <Login />
      ) : (
        <Fragment>
          <StyledPieChart
            data={chartData}
            signalListeners={{ click: handlePieClick, hover: handlePieClick }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              filter: "drop-shadow(2px 4px 6px black)",
            }}
          />
          <ProgressBar progress={info?.progress} total={info?.total} />
        </Fragment>
      )}
      {victim ? (
        <Redirect to={`/declutter/mass_destruction?victim=${victim}`} />
      ) : null}
      {missionSuccessful && <Redirect to="/leftovers" />}
    </PageContainer>
  );
};

const StyledPieChart = styled(PieChart)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProgressLife = keyframes`
  0% { 
    transform: translate3d(-30%, 0, 0);
  }

  100% { 
    transform: translate3d(0%);
  }
`;

const ProgressBar = ({ progress, total }) => {
  console.log("Progress Bar: ", progress, total);
  return (
    <ProgressBarContainer>
      <ProgressPowa />
      <ProgressRemaining progress={progress} total={total} />
      <ProgressBarMask />
    </ProgressBarContainer>
  );
};

const ProgressPowa = styled.div`
  height: 100%;
  width: 200%;
  position: absolute;
  z-index: -2;

  animation: ${ProgressLife} 1s linear infinite running;
  will-change: transform;
  background: repeating-linear-gradient(
    120deg,
    rgb(221, 0, 0) 0%,
    rgb(206, 215, 0) 10%,
    rgb(76, 255, 0) 20%,
    rgb(221, 0, 0) 30%
  );
  filter: blur(10px); /* Blend the colours */
`;

const ProgressRemaining = styled.div`
  /** This is the progress 'remaining' bar. It's grey  */
  position: absolute;
  height: 100%;
  width: 100%;

  background: grey;
  transform: ${({ progress, total }: { progress: any; total: any }) =>
    `translate3d(${(progress / total) * 100}%, 0, 0)`};
  z-index: -2;
  box-shadow: inset 1px 0px 23px 10px #3a3a3a;
`;

const ProgressBarMask = styled.div`
  /** 
  This serves to create a mask around the progress bar.
  It masks the sliding PROGRESS POWA on the x-axis.
  It masks the colour bleed of the blur on PROGRESS POWA on the y-axis.
  */
  position: absolute;
  height: 100%;
  width: 100%;
  box-shadow: -400px 0px 3px 100vw #ffffff, 400px 0px 3px 100vw #ffffff;
  z-index: -1;
  border-radius: 15px;
`;

const ProgressBarContainer = styled.div`
  flex-basis: 8%;
  width: 50%;
  border-radius: 15px;
  position: relative;

  box-shadow: 0px 10px 13px -7px #000000,
    inset 1px 0px 23px 10px rgba(58, 58, 58, 0);
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export { Declutter };
