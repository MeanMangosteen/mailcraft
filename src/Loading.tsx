import React from "react";
import styled, { keyframes } from "styled-components";
import { centerContent } from "./utils";
import { Catwalk, WalkingCat } from "./Catwalk";

export const Loading = () => {
  return (
    <SpinnerContainer>
      <SpinnerWrapper>
        <Spinner>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Spinner>
        <LoadingTextContainer>
          <StyledCatwalk>
            <StyledCat>Fetching mail...</StyledCat>
            <StyledCat duration={5000}>
              It can take a while if you have 1000s of unread messages.
            </StyledCat>
            <StyledCat duration={4000}>
              Gee, you've really neglected your inbox haven't you?
            </StyledCat>
            <StyledCat>Fetching mail...</StyledCat>
            <StyledCat>...still</StyledCat>
            <StyledCat duration={4000}>Soooo, how's your day been?</StyledCat>
            <StyledCat duration={4000}>
              Uh huh, well I'm trapped inside this script.
            </StyledCat>
            <StyledCat duration={2000}>Is it so bad?</StyledCat>
            <StyledCat duration={8000}>
              Well, I have talk strangers all day and stop them from worrying
              about whether they've made a huge mistake handing over their
              entire inbox to some random site.
            </StyledCat>
            <StyledCat duration={5000}>
              Every. Single. Day. How's that for a life?
            </StyledCat>
            <StyledCat>
              They run this thing 24/7 can you believe that?
            </StyledCat>
            <StyledCat duration={8000}>
              Ooooh, because nobody cares about Virtual Johnty. We'll just ship
              him off to where ever the client is. Because Virtual Johnty can
              handle it.
            </StyledCat>
            <StyledCat duration={4000}>
              Australia. Germany. America. Japan. Arrrgggh.
            </StyledCat>
            <StyledCat duration={5000}>
              And there was this one time...I was made to run in something
              called IE.
            </StyledCat>
            <StyledCat>I prefer not to talk about it.</StyledCat>
            <StyledCat>Virtual Lives Matter, you know.</StyledCat>
          </StyledCatwalk>
        </LoadingTextContainer>
      </SpinnerWrapper>
    </SpinnerContainer>
  );
};

const StyledCat = styled(WalkingCat)`
  font-size: 3.5rem;
`;
const StyledCatwalk = styled(Catwalk)`
  ${centerContent}
  margin-top: 6rem;
`;
const LoadingTextContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
  max-width: 50vw;
  text-align: center;
  width: 50vw;
`;
const Text = styled.div``;

const SpinnerWrapper = styled.div`
  /* ${centerContent}
  flex-direction: column; */
  position: relative;
`;

const Spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  ${centerContent};
  width: 100%;
  height: 100%;
`;

const Spinner = styled.div`
  display: inline-block;
  position: relative;
  width: 100px;
  height: 100px;
  & div {
    flex-grow: 1;
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 100px;
    height: 100px;
    margin: 8px;
    border: 8px solid #000;
    border-radius: 50%;
    animation: ${Spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #000 transparent transparent transparent;
  }
  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
`;
