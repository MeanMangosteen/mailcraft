import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import PieChart from "./PieChart";
import { Redirect } from "react-router-dom";
import { useMail } from "../reducers/mail";
import { ProgressBar } from "./ProgressBar";

export const ChooseVictim = () => {
  const [chartData, setChartData] = useState<any>(undefined);
  const [selectedVictim, setVictim] = useState<string | null>(null);
  const { mail } = useMail();

  useEffect(() => {
    if (!mail) return; // wait for mail fetch
    // get all the email senders
    const senders = mail.map((m) => m.envelope.from[0].address.split("@")[1]);
    // Tally the no. emails sent by each sender
    const count = {};
    senders.forEach((m) => {
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
          signalListeners={{ click: handlePieClick }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            filter: "drop-shadow(2px 4px 6px black)",
          }}
        />
      </PieChartWrapper>
      <ProgressBar />
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

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
