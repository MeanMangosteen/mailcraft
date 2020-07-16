import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { ShowTextWithStyle, StylishItem } from "../ShowTextWithStyle";
import { SwitchTransition, Transition } from "react-transition-group";
import { HomePageButton } from "./HomePageButton";
import { BaseNavLink } from "../NavBar/NavBar";
import { NavLink } from "react-router-dom";

type EpisodeProps = {
  state: any;
  onFinish: () => void;
};

enum Images {
  Empty = "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  FailedDreams = "https://raw.githubusercontent.com/gist/ll-aashwin-ll/5b31951331a62392fe55dd0368205712/raw/f6f26b68b8c64abb11e6588c99993590580a057e/failed-dreams.svg",
  GymSurprise = "https://raw.githubusercontent.com/gist/ll-aashwin-ll/3254e0bec1848bf69ef737b166aa5b5d/raw/d878dc109449ae8f833a10ec16a6024397ac66fc/gym-surprise.svg",
  Declutter = "https://raw.githubusercontent.com/gist/ll-aashwin-ll/435d3a2d0ffdbb23aabd080892ab6160/raw/7d43d44ac00343f43b953549e4c14214ed1158c0/declutter.svg",
  Insights = "https://raw.githubusercontent.com/gist/ll-aashwin-ll/ad413b60bc3b4e1963a18adfa8c310cb/raw/779dc0bf90abae428c2a753c8ac717155386349d/insights.svg",
  Insomnia = "https://i.imgur.com/wQlhbfX.jpg",
  Shredded = "https://i.imgur.com/Y4Wfd4p.jpg",
  CleanRoom = "https://i.imgur.com/G8jSfk0.jpg",
  Buddha = "https://i.imgur.com/pkrBtZX.jpg",
}

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
        <SwitchTransition mode={"out-in"}>
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
          <Text>But a hygenic mailbox will</Text>
        </StylishItem>
        <StylishItem>
          <Text>
            Start your journey today and let Mailcraft solve all your live's
            problems!
          </Text>
        </StylishItem>
      </ShowTextWithStyle>
    </TextContainer>
    <PictureContainer>
      <ButtonContainer as="a" href="/declutter">
        <HomePageButton
          imgSrc={Images.Declutter}
          title="Declutter"
          path="/declutter"
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

const Image = styled.img`
  transition: 0.5s;
  opacity: ${(props: { state: any }) => (props.state === "entered" ? 1 : 0)};
  will-change: opacity;

  object-fit: contain;
  height: 100%;
  width: 100%;
`;
