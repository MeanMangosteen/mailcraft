import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { SwitchTransition, Transition } from "react-transition-group";
import { HomePageButton } from "./HomePageButton";
import { BaseNavLink } from "../NavBar/NavBar";
import { NavLink } from "react-router-dom";
// import { ReactComponent as FailedDreamsSVG } from "../images/failed-dreams.svg";
import FailedDreamsSVG from "../images/failed-dreams.svg";
import GymSurpriseSVG from "../images/gym-surprise.svg";
import DeclutterSVG from "../images/declutter-badge.svg";
import InsightsSVG from "../images/insights-badge.svg";

type EpisodeProps = {
  state: any;
  onFinish: () => void;
};

const Images = {
  Empty:
    "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  FailedDreams: FailedDreamsSVG,
  GymSurprise: GymSurpriseSVG,
  Declutter: DeclutterSVG,
  Insights: InsightsSVG,
} as const;

export const Episode1 = ({ state, onFinish }: EpisodeProps) => {
  const [currImage, setCurrImage] = useState<any>(Images.Empty);
  return (
    <EpisodeContainer state={state}>
      <TextContainer>
        <ShowTextWithStyle key="ep1" onFinish={onFinish}>
          <StylishItem
            onShow={() => {
              setCurrImage(Images.FailedDreams);
            }}
          >
            <Text>Do you have sleepless nights?</Text>
          </StylishItem>
          <StylishItem>
            <Text>Don't have the perfect body?</Text>
          </StylishItem>
          <StylishItem>
            <Text>Dreams not coming true?</Text>
          </StylishItem>
        </ShowTextWithStyle>
      </TextContainer>
      <PictureContainer>
        <SwitchTransition>
          <Transition key={currImage} timeout={200}>
            {(state) => <Image src={currImage} state={state} />}
          </Transition>
        </SwitchTransition>
      </PictureContainer>
    </EpisodeContainer>
  );
};

export const Episode2 = ({ state, onFinish }: EpisodeProps) => {
  const [currImage, setCurrImage] = useState<any>(Images.Empty);
  return (
    <EpisodeContainer state={state}>
      <TextContainer>
        <ShowTextWithStyle key="ep2" onFinish={onFinish}>
          <StylishItem onShow={() => setCurrImage(Images.GymSurprise)}>
            <Text>Don't listen to what they say...</Text>
          </StylishItem>
          <StylishItem>
            <Text>It's not time and effort that will get you there!</Text>
          </StylishItem>
          <StylishItem>
            <Text>But a hygenic mailbox will...</Text>
          </StylishItem>
        </ShowTextWithStyle>
      </TextContainer>
      <PictureContainer>
        <SwitchTransition mode={"out-in"}>
          <Transition key={currImage} timeout={200}>
            {(state) => <Image src={currImage} state={state} />}
          </Transition>
        </SwitchTransition>
      </PictureContainer>
    </EpisodeContainer>
  );
};

export const Episode3 = ({ state, onFinish }: EpisodeProps) => (
  <EpisodeContainer state={state}>
    <TextContainer>
      <ShowTextWithStyle key="ep3" onFinish={onFinish}>
        <StylishItem>
          <Text>
            Declutter your inbox and let Mailcraft make your dreams come true!
          </Text>
        </StylishItem>
        <StylishItem>
          <SmallText>
            ...if you use gmail, otherwise you're on your own kiddo.
          </SmallText>
        </StylishItem>
      </ShowTextWithStyle>
    </TextContainer>
    <PictureContainer>
      <ButtonContainer>
        <HomePageButton
          imgSrc={Images.Declutter}
          title="Declutter"
          path="/declutter"
          levitate
        />
        <HomePageButton
          imgSrc={Images.Insights}
          title="Insights"
          path="/insights"
        />
      </ButtonContainer>
    </PictureContainer>
  </EpisodeContainer>
);

const EpisodeContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 100vh;
  /* height: 100%; */

  transition: 0.5s;
  opacity: ${(props: { state: any }) => (props.state === "entered" ? 1 : 0)};
  will-change: opacity;
`;

const ButtonContainer = styled.div`
  display: flex;
  /* flex-grow: 1; */
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PictureContainer = styled.div`
  box-sizing: border-box;
  padding: 3rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`;

const Text = styled.div`
  text-align: center;
  font-size: 4rem;
  margin: 2rem;
`;

const SmallText = styled.div`
  text-align: center;
  font-size: 1.5rem;
  margin: 2rem;
`;

const Image = styled.img`
  transition: 0.5s;
  opacity: ${(props: { state: any }) => (props.state === "entered" ? 1 : 0)};
  will-change: opacity;

  object-fit: contain;
  height: 100%;
  width: 100%;
`;
