import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import PieChart from "./PieChart";
import { Redirect } from "react-router-dom";
import { useMail } from "../reducers/mail";

interface DeclutterProps {
  className?: string;
}

export const ChooseVictim = ({}) => {
  const [chartData, setChartData] = useState<any>(undefined);
  const [selectedVictim, setVictim] = useState<string | null>(null);
  const { mail, totalUnread, userProgress } = useMail();

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
  }, [mail]);

  const handlePieClick = (name, leMagic) => {
    console.log(leMagic);
    setVictim(leMagic.id);
  };

  return (
    <PageContainer>
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
      <ProgressBar progress={userProgress} total={totalUnread} />
      {selectedVictim ? (
        <Redirect
          to={`/declutter/mass-destruction/destroy?victim=${selectedVictim}`}
        />
      ) : null}
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

const TextShine = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  80% {
    filter: hue-rotate(0deg);
  }
  90% {
    filter: hue-rotate(295deg);
  }
`;
const VictimTextHighlight = styled.div`
  margin: 0;
  font-size: 4rem;
  background: linear-gradient(
    90deg,
    rgba(131, 58, 180, 1) 0%,
    rgba(253, 29, 29, 1) 50%,
    rgba(252, 176, 69, 1) 100%
  );

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${TextShine} 3s infinite;
  animation-fill-mode: forwards;
`;

const PieChartWrapper = styled.div`
  position: relative;
`;

const ProgressLife = keyframes`
  0% { 
    transform: translate3d(-50%, 0, 0);
  }

  100% { 
    transform: translate3d(0%);
  }
`;

// OMGTODO: separate file
export const ProgressBar = ({ progress, total, className = "" }) => {
  return (
    <ProgressBarContainer className={className}>
      <ProgressPowa />
      <ProgressRemaining progress={progress} total={total} />
      <ProgressBarMask />
      <ProgressTextWrapper progress={progress} total={total}>
        <ProgressText>{`${total - progress} to go!`}</ProgressText>
      </ProgressTextWrapper>
      <TotalText>{total}</TotalText>
    </ProgressBarContainer>
  );
};

const ProgressTextWrapper = styled.div`
  position: absolute;
  width: 100%;
  transform: ${({ progress, total }: { progress: number; total: number }) =>
    `translate3d(${(progress / total) * 100}%, 0, 0)`};
  transition: transform 0.3s ease-out;
`;

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
  top: -2px;
  left: 0;
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
    background: linear-gradient(to top, #a7a6a6 0%, transparent 100%);
  }
`;

const ProgressPowa = styled.div`
  height: 100%;
  width: 200%;
  position: absolute;
  z-index: -2;

  animation: ${ProgressLife} 1s linear infinite running;
  will-change: transform;
  /* background: repeating-linear-gradient(
    120deg,
    rgb(221, 0, 0) 0%,
    rgb(206, 215, 0) 10%,
    rgb(76, 255, 0) 20%,
    rgb(221, 0, 0) 30%
  ); */
  /* background: repeating-linear-gradient(
    120deg,
    #59981a 0%,
    #db1f48 10%,
    #81b622 20%,
    #59981a 30%
  ); */
  background: repeating-linear-gradient(
    120deg,
    hsl(0, 100%, 50%) 0%,
    hsl(43, 100%, 50%) 10%,
    hsla(64, 78%, 50%, 1) 20%,
    hsl(43, 100%, 50%) 40%,
    hsl(0, 100%, 50%) 50%
  );
  filter: blur(10px); /* Blend the colours */
`;

const ProgressRemaining = styled.div`
  /** This is the progress 'remaining' bar. It's grey  */
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -2;

  background: grey;
  box-shadow: inset 1px 0px 23px 10px #3a3a3a;

  transform: ${({ progress, total }: { progress: any; total: any }) =>
    `translate3d(${(progress / total) * 100}%, 0, 0)`};
  transition: transform 0.3s ease-out;
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
