import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { ShowTextWithStyle, StylishItem } from "./ShowTextWithStyle";
import { SwitchTransition, Transition } from "react-transition-group";

const Episode1 = ({ state }) => (
  <EpisodeContainer state={state}>
    <ShowTextWithStyle key="ep1" onFinish={() => setCurrEpisode("ep2")}>
      <Text>Do you have sleepless nights?</Text>
      <Text>Don't have the perfect body?</Text>
      <StylishItem onShow={() => console.log("we showin baby!")}>
        <Text>Dreams not coming true?</Text>
      </StylishItem>
    </ShowTextWithStyle>
  </EpisodeContainer>
);

const Episode2 = ({ state }) => (
  <EpisodeContainer state={state}>
    <ShowTextWithStyle key="ep2" onFinish={() => setCurrEpisode("ep3")}>
      <Text>Don't listen to what they say...</Text>
      <Text>It's not time and effort that will get you there!</Text>
    </ShowTextWithStyle>
  </EpisodeContainer>
);
const [currEpisode, setCurrEpisode] = useState("ep1");

const Episode3 = ({ state }) => (
  <EpisodeContainer state={state}>
    <ShowTextWithStyle key="ep3" onFinish={() => {}}>
      <Text>But a hygenic mailbox will</Text>
      <Text>
        Start your journey today and let Mailcraft solve all your live's
        problems!
      </Text>
    </ShowTextWithStyle>
  </EpisodeContainer>
);

export const Home = () => {
  return (
    <HomeContainer>
      <TextContainer>
        <SwitchTransition mode={"out-in"}>
          <Transition key={currEpisode} timeout={200}>
            {(state) =>
              currEpisode === "ep1" ? (
                <Episode1 state={state} />
              ) : currEpisode === "ep2" ? (
                <Episode2 state={state} />
              ) : (
                <Episode3 state={state} />
              )
            }
          </Transition>
        </SwitchTransition>
      </TextContainer>
      <Pictures />
    </HomeContainer>
  );
};

const EpisodeContainer = styled.div`
  transition: 0.5s;
  opacity: ${(props: { state: any }) => (props.state === "entered" ? 1 : 0)};
`;
const Text = styled.div`
  text-align: center;
  font-size: 4rem;
  margin: 2rem;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Pictures = styled.div`
  background: red;
`;

const HomeContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
`;
