import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";
import { Episode1, Episode2, Episode3 } from "./Episodes";

export const Home = () => {
  const [currEpisode, setCurrEpisode] = useState("ep3");
  return (
    <HomeContainer>
      {/* <TextContainer> */}
      <SwitchTransition mode={"out-in"}>
        <Transition key={currEpisode} timeout={200}>
          {(state) =>
            currEpisode === "ep1" ? (
              <Episode1 state={state} onFinish={() => setCurrEpisode("ep2")} />
            ) : currEpisode === "ep2" ? (
              <Episode2 state={state} onFinish={() => setCurrEpisode("ep3")} />
            ) : (
              <Episode3 state={state} onFinish={() => {}} />
            )
          }
        </Transition>
      </SwitchTransition>
    </HomeContainer>
  );
};

const HomeContainer = styled.div``;