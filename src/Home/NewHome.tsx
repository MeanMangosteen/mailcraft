import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { SwitchTransition, Transition } from "react-transition-group";
import { Episode1, Episode2, Episode3 } from "./Episodes";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [cookies, setCookie] = useCookies();
  const [currEpisode, setCurrEpisode] = useState(() =>
    cookies?.homepageCompleted ? "ep3" : "ep1"
  );
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
              <Episode3
                state={state}
                onFinish={() => {
                  var expiry = new Date();
                  expiry.setHours(expiry.getHours() + 5); // 5 hours from now
                  !cookies?.homepageComplete &&
                    setCookie("homepageCompleted", true, { expires: expiry });
                }}
              />
            )
          }
        </Transition>
      </SwitchTransition>
    </HomeContainer>
  );
};

const HomeContainer = styled.div``;
