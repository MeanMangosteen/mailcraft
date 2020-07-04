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
          <PieChartWrapper>
            <ChartTitle>{`Top\nOffenders`}</ChartTitle>
            <VictimText>
              {`Choose your\n`}
              <VictimTextHighlight>Victim</VictimTextHighlight>
            </VictimText>
            <PieChart
              data={chartData}
              signalListeners={{ click: handlePieClick, hover: handlePieClick }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                filter: "drop-shadow(2px 4px 6px black)",
              }}
            />
          </PieChartWrapper>
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

const ChartTitle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 6rem;
  font-weight: bold;
  transform: translate3d(-100%, 0, 0);
  white-space: break-spaces;
  text-align: center;
`;

const VictimText = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  font-weight: bold;
  transform: translate3d(100%, 0, 0);
  white-space: break-spaces;

  font-style: italic;
  color: #8ae2c4;
  font-size: 4rem;
  text-align: inherit;
`;

const VictimTextHighlight = styled.h1`
  position: relative;
  margin: 0;
  font-size: 4rem;
  /* background: -webkit-linear-gradient(#eee, #333); */
  background: #8ae2c4;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    background: blue;
    height: 100%;
    width: 100%;
  }
  /* &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(
      322deg,
      rgba(255, 255, 255, 0) 26%,
      rgba(255, 255, 255, 0) 43%,
      rgba(143, 0, 0, 1) 47%,
      rgba(143, 0, 0, 1) 53%,
      rgba(255, 255, 255, 0) 57%,
      rgba(255, 255, 255, 0) 71%
    );
    height: 100%;
    width: 100%;
    transform: translate3d(-50%, 0, 0);
  } */
`;

const PieChartWrapper = styled.div`
  position: relative;
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
      <ProgressText progress={progress} total={total}>
        {`${total - progress} to go!`}
      </ProgressText>
      <TotalText>{total}</TotalText>
    </ProgressBarContainer>
  );
};

const TotalText = styled.div`
  position: absolute;

  font-size: 3rem;

  /* Align text past the edge and in the middle */
  right: 0;
  top: 50%;
  transform: translate3d(100%, -50%, 0);

  /* Give the man some space here */
  padding-left: 2rem;
  box-sizing: border-box;
`;

const ProgressText = styled.div`
  position: absolute;
  font-size: 2rem;
  top: 0;
  left: ${({ progress, total }: { progress: number; total: number }) =>
    `${(progress / total) * 100}%`};
  transform: translate3d(-50%, -100%, 0);
  padding-bottom: 2rem;
  box-sizing: border-box;

  &::before,
  &::after {
    content: "";
    position: absolute;
    display: block;
    bottom: 0;
    right: 50%;

    width: 1px;
    height: 30%;
    /* transform: translateY(100%); */
  }

  &::before {
    bottom: 0;
    background: linear-gradient(to top, #333 0%, transparent 100%);
  }

  &::after {
    /* top: 50%; */
    bottom: 0;
    transform: translateY(100%);
    background: linear-gradient(to bottom, #333 0%, transparent 100%);
  }
`;

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
